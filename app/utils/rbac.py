"""
Role-Based Access Control utilities.
"""
from functools import wraps
from typing import List, Optional
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from ..models.user import User, UserRole
from ..db import get_db
from .auth import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exception
    
    return user


def require_role(required_roles: List[UserRole]):
    """Decorator to require specific roles."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Find user in kwargs or args
            user = None
            for arg in args:
                if isinstance(arg, User):
                    user = arg
                    break
            
            if not user:
                for key, value in kwargs.items():
                    if isinstance(value, User):
                        user = value
                        break
            
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            
            if user.role not in required_roles:
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied. Required roles: {[r.value for r in required_roles]}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def require_admin(func):
    """Decorator to require admin role."""
    return require_role([UserRole.ADMIN])(func)


def require_manager_or_admin(func):
    """Decorator to require manager or admin role."""
    return require_role([UserRole.MANAGER, UserRole.ADMIN])(func)


def require_same_company(user: User, target_company_id: int):
    """Check if user belongs to the same company."""
    if user.company_id != target_company_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied. You can only access resources from your company."
        )


def require_same_company_or_admin(user: User, target_company_id: int):
    """Check if user belongs to the same company or is admin."""
    if user.role != UserRole.ADMIN and user.company_id != target_company_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied. You can only access resources from your company."
        )


def can_manage_user(current_user: User, target_user: User) -> bool:
    """Check if current user can manage target user."""
    # Admin can manage anyone in their company
    if current_user.role == UserRole.ADMIN and current_user.company_id == target_user.company_id:
        return True
    
    # Manager can manage employees in their company
    if (current_user.role == UserRole.MANAGER and 
        current_user.company_id == target_user.company_id and
        target_user.role == UserRole.EMPLOYEE):
        return True
    
    # Users can manage themselves
    if current_user.id == target_user.id:
        return True
    
    return False


def can_approve_expense(user: User, expense) -> bool:
    """Check if user can approve specific expense."""
    # Must be in same company
    if user.company_id != expense.company_id:
        return False
    
    # Admin can approve any expense in their company
    if user.role == UserRole.ADMIN:
        return True
    
    # Manager can approve expenses from their subordinates
    if user.role == UserRole.MANAGER:
        # Check if expense submitter is a subordinate
        return expense.submitter.manager_id == user.id
    
    return False


def can_view_expense(user: User, expense) -> bool:
    """Check if user can view specific expense."""
    # Must be in same company
    if user.company_id != expense.company_id:
        return False
    
    # Admin can view any expense in their company
    if user.role == UserRole.ADMIN:
        return True
    
    # Users can view their own expenses
    if user.id == expense.submitter_id:
        return True
    
    # Manager can view expenses from their subordinates
    if user.role == UserRole.MANAGER and expense.submitter.manager_id == user.id:
        return True
    
    return False
