"""
Expense management routes.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..db import get_db
from ..schemas.expense import (
    Expense, ExpenseCreate, ExpenseUpdate, ExpenseWithDetails, 
    ExpenseAction, ExpenseListResponse
)
from ..schemas.common import PaginationParams, MessageResponse, FileUploadResponse
from ..services.expense_service import ExpenseService
from ..utils.rbac import get_current_user, can_view_expense, can_approve_expense
from ..utils.file_storage import get_storage
from ..models.expense import ExpenseStatus, ExpenseCategory
from ..models.expense_file import ExpenseFile
from ..models.user import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=ExpenseWithDetails)
async def create_expense(
    amount: float = Form(...),
    currency: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    expense_date: str = Form(...),
    files: List[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new expense."""
    try:
        # Parse expense date
        expense_date_obj = datetime.fromisoformat(expense_date.replace('Z', '+00:00'))
        
        # Create expense data
        expense_data = ExpenseCreate(
            amount=amount,
            currency=currency,
            category=ExpenseCategory(category),
            description=description,
            expense_date=expense_date_obj
        )
        
        # Create expense
        expense_service = ExpenseService(db)
        expense = await expense_service.create_expense(expense_data, current_user)
        
        # Handle file uploads
        if files:
            storage = get_storage()
            for file in files:
                if file.filename:
                    file_info = await storage.save_file(file)
                    # Create expense file record
                    expense_file = ExpenseFile(
                        expense_id=expense.id,
                        filename=file_info["filename"],
                        original_filename=file_info["original_filename"],
                        file_path=file_info["file_path"],
                        file_size=file_info["file_size"],
                        mime_type=file_info["mime_type"]
                    )
                    db.add(expense_file)
        
        db.commit()
        
        # Return expense with details
        return expense_service.get_expense(expense.id, current_user)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Create expense error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{expense_id}", response_model=ExpenseWithDetails)
async def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expense by ID."""
    try:
        expense_service = ExpenseService(db)
        expense = expense_service.get_expense(expense_id, current_user)
        return expense
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Get expense error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/", response_model=ExpenseListResponse)
async def get_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    submitter_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expenses with filtering and pagination."""
    try:
        pagination = PaginationParams(page=page, per_page=per_page)
        
        expense_service = ExpenseService(db)
        expenses, total = await expense_service.get_expenses(
            current_user=current_user,
            pagination=pagination,
            status=ExpenseStatus(status) if status else None,
            category=ExpenseCategory(category) if category else None,
            submitter_id=submitter_id
        )
        
        total_pages = (total + per_page - 1) // per_page
        
        return ExpenseListResponse(
            expenses=expenses,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Get expenses error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/{expense_id}/action", response_model=ExpenseWithDetails)
async def approve_expense(
    expense_id: int,
    action_data: ExpenseAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Approve or reject an expense."""
    try:
        expense_service = ExpenseService(db)
        expense = await expense_service.approve_expense(expense_id, action_data, current_user)
        return expense
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Approve expense error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/{expense_id}/attach-receipt", response_model=FileUploadResponse)
async def attach_receipt(
    expense_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Attach additional receipt to expense."""
    try:
        # Check if expense exists and user can access it
        expense_service = ExpenseService(db)
        expense = expense_service.get_expense(expense_id, current_user)
        
        # Save file
        storage = get_storage()
        file_info = await storage.save_file(file)
        
        # Create expense file record
        expense_file = ExpenseFile(
            expense_id=expense_id,
            filename=file_info["filename"],
            original_filename=file_info["original_filename"],
            file_path=file_info["file_path"],
            file_size=file_info["file_size"],
            mime_type=file_info["mime_type"]
        )
        db.add(expense_file)
        db.commit()
        
        return FileUploadResponse(
            filename=file_info["filename"],
            file_path=file_info["file_path"],
            file_size=file_info["file_size"],
            mime_type=file_info["mime_type"]
        )
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Attach receipt error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/statistics/summary")
async def get_expense_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expense statistics for the company."""
    try:
        expense_service = ExpenseService(db)
        stats = expense_service.get_expense_statistics(current_user.company_id)
        return stats
    except Exception as e:
        logger.error(f"Get statistics error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
