"""
User management routes.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db import get_db
from ..schemas.user import User, UserCreate, UserUpdate, UserWithCompany
from ..schemas.common import PaginatedResponse, MessageResponse
from ..services.user_service import UserService
from ..utils.rbac import get_current_user, require_admin, require_manager_or_admin
from ..models.user import UserRole
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=User)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create a new user (admin only)."""
    try:
        user_service = UserService(db)
        user = user_service.create_user(user_data, current_user)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Create user error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/", response_model=List[User])
async def get_users(
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Get all users in the company."""
    try:
        user_service = UserService(db)
        users = user_service.get_users_by_company(current_user.company_id, current_user)
        return users
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        logger.error(f"Get users error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{user_id}", response_model=UserWithCompany)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user by ID."""
    try:
        user_service = UserService(db)
        user = user_service.get_user_with_details(user_id, current_user)
        return user
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Update user information."""
    try:
        user_service = UserService(db)
        user = user_service.update_user(user_id, user_data, current_user)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Update user error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/{user_id}", response_model=MessageResponse)
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Deactivate user (admin only)."""
    try:
        user_service = UserService(db)
        user_service.deactivate_user(user_id, current_user)
        return MessageResponse(message="User deactivated successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Deactivate user error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/managers/list", response_model=List[User])
async def get_managers(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all managers in the company (admin only)."""
    try:
        user_service = UserService(db)
        managers = user_service.get_managers(current_user.company_id)
        return managers
    except Exception as e:
        logger.error(f"Get managers error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/employees/{manager_id}", response_model=List[User])
async def get_employees(
    manager_id: int,
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Get all employees under a manager."""
    try:
        user_service = UserService(db)
        employees = user_service.get_employees(manager_id)
        return employees
    except Exception as e:
        logger.error(f"Get employees error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
