"""
User service for user management.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional, Tuple
from ..models.user import User, UserRole
from ..schemas.user import UserCreate, UserUpdate, UserWithCompany
from ..utils.auth import get_password_hash, verify_password
from ..utils.rbac import can_manage_user
import logging

logger = logging.getLogger(__name__)


class UserService:
    """User service."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: UserCreate, created_by: User) -> User:
        """Create a new user."""
        # Check if creator can manage users
        if created_by.role not in [UserRole.ADMIN, UserRole.MANAGER]:
            raise ValueError("Insufficient permissions to create users")
        
        # Check if user already exists
        existing_user = self.db.query(User).filter(
            or_(User.email == user_data.email, User.username == user_data.username)
        ).first()
        
        if existing_user:
            raise ValueError("User with this email or username already exists")
        
        # Validate manager assignment
        if user_data.manager_id:
            manager = self.get_user_by_id(user_data.manager_id)
            if not manager or manager.company_id != created_by.company_id:
                raise ValueError("Invalid manager")
            
            # Only managers and admins can be assigned as managers
            if manager.role not in [UserRole.MANAGER, UserRole.ADMIN]:
                raise ValueError("Manager must have manager or admin role")
        
        # Create user
        user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=get_password_hash(user_data.password),
            role=user_data.role,
            company_id=user_data.company_id,
            manager_id=user_data.manager_id
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_users_by_company(self, company_id: int, current_user: User) -> List[User]:
        """Get all users in a company."""
        # Check permissions
        if current_user.role == UserRole.ADMIN:
            # Admin can see all users in their company
            if current_user.company_id != company_id:
                raise ValueError("Access denied")
            return self.db.query(User).filter(User.company_id == company_id).all()
        
        elif current_user.role == UserRole.MANAGER:
            # Manager can see their subordinates and themselves
            return self.db.query(User).filter(
                and_(
                    User.company_id == company_id,
                    or_(
                        User.manager_id == current_user.id,
                        User.id == current_user.id
                    )
                )
            ).all()
        
        else:
            # Employee can only see themselves
            return [current_user]
    
    def update_user(self, user_id: int, user_data: UserUpdate, updated_by: User) -> User:
        """Update user information."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Check permissions
        if not can_manage_user(updated_by, user):
            raise ValueError("Insufficient permissions to update this user")
        
        # Update fields
        update_data = user_data.dict(exclude_unset=True)
        
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def deactivate_user(self, user_id: int, deactivated_by: User) -> bool:
        """Deactivate a user."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Check permissions
        if not can_manage_user(deactivated_by, user):
            raise ValueError("Insufficient permissions to deactivate this user")
        
        # Cannot deactivate yourself
        if user.id == deactivated_by.id:
            raise ValueError("Cannot deactivate yourself")
        
        user.is_active = False
        self.db.commit()
        
        return True
    
    def get_user_with_details(self, user_id: int, current_user: User) -> UserWithCompany:
        """Get user with company and manager details."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Check permissions
        if not can_manage_user(current_user, user):
            raise ValueError("Insufficient permissions to view this user")
        
        # Get company name
        company_name = user.company.name if user.company else None
        
        # Get manager name
        manager_name = user.manager.full_name if user.manager else None
        
        return UserWithCompany(
            **user.__dict__,
            company_name=company_name,
            manager_name=manager_name
        )
    
    def get_managers(self, company_id: int) -> List[User]:
        """Get all managers in a company."""
        return self.db.query(User).filter(
            and_(
                User.company_id == company_id,
                User.role == UserRole.MANAGER,
                User.is_active == True
            )
        ).all()
    
    def get_employees(self, manager_id: int) -> List[User]:
        """Get all employees under a manager."""
        return self.db.query(User).filter(
            and_(
                User.manager_id == manager_id,
                User.is_active == True
            )
        ).all()