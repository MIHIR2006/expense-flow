"""
Admin routes for system management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..schemas.common import MessageResponse
from ..utils.rbac import get_current_user, require_admin
from ..models.user import User
from ..models.expense import Expense, ExpenseStatus
from ..models.audit_log import AuditLog, AuditAction
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/override/{expense_id}", response_model=MessageResponse)
async def admin_override(
    expense_id: int,
    reason: str,
    action: str,  # "approve" or "reject"
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin override for expense approval/rejection."""
    try:
        # Get expense
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise ValueError("Expense not found")
        
        # Check if expense is in same company
        if expense.company_id != current_user.company_id:
            raise ValueError("Access denied")
        
        # Update expense status
        if action == "approve":
            expense.status = ExpenseStatus.APPROVED
            audit_action = AuditAction.EXPENSE_APPROVED
            description = f"Expense approved by admin override: {reason}"
        elif action == "reject":
            expense.status = ExpenseStatus.REJECTED
            audit_action = AuditAction.EXPENSE_REJECTED
            description = f"Expense rejected by admin override: {reason}"
        else:
            raise ValueError("Invalid action. Must be 'approve' or 'reject'")
        
        # Create audit log
        audit_log = AuditLog(
            user_id=current_user.id,
            expense_id=expense_id,
            action=audit_action,
            description=description
        )
        db.add(audit_log)
        db.commit()
        
        return MessageResponse(message=f"Expense {action}d by admin override")
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Admin override error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/audit-logs")
async def get_audit_logs(
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get audit logs for the company (admin only)."""
    try:
        offset = (page - 1) * per_page
        
        # Get audit logs for the company
        logs = db.query(AuditLog).join(Expense).filter(
            Expense.company_id == current_user.company_id
        ).order_by(AuditLog.created_at.desc()).offset(offset).limit(per_page).all()
        
        total = db.query(AuditLog).join(Expense).filter(
            Expense.company_id == current_user.company_id
        ).count()
        
        return {
            "logs": logs,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }
        
    except Exception as e:
        logger.error(f"Get audit logs error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/company-stats")
async def get_company_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get company statistics (admin only)."""
    try:
        from ..services.expense_service import ExpenseService
        
        expense_service = ExpenseService(db)
        stats = expense_service.get_expense_statistics(current_user.company_id)
        
        # Add user count
        user_count = db.query(User).filter(
            User.company_id == current_user.company_id,
            User.is_active == True
        ).count()
        
        return {
            "expense_stats": stats,
            "total_users": user_count,
            "company_id": current_user.company_id
        }
        
    except Exception as e:
        logger.error(f"Get company stats error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
