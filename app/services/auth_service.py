"""
Authentication service for user management.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, Tuple
from ..models.user import User, UserRole
from ..models.company import Company
from ..schemas.user import UserCreate, UserSignup, UserLogin
from ..schemas.auth import Token
from ..utils.auth import verify_password, get_password_hash, create_tokens
from ..utils.external_apis import country_api
from ..schemas.common import CountryInfo
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Authentication service."""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def signup(self, signup_data: UserSignup) -> Tuple[User, Company, Token]:
        """Create company and admin user (first user signup)."""
        # Get country information
        country_info = await country_api.get_country_info(signup_data.country)
        if not country_info:
            raise ValueError(f"Country '{signup_data.country}' not found")
        
        # Create company
        company = Company(
            name=f"{signup_data.name}'s Company",  # Default company name
            base_currency=country_info.currency,
            country_code=country_info.code
        )
        self.db.add(company)
        self.db.flush()  # Get company ID
        
        # Create admin user
        user = User(
            email=signup_data.email,
            username=signup_data.email.split('@')[0],  # Use email prefix as username
            full_name=signup_data.name,
            hashed_password=get_password_hash(signup_data.password),
            role=UserRole.ADMIN,
            company_id=company.id
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        self.db.refresh(company)
        
        # Create tokens
        tokens = create_tokens(user.id, company.id, user.role.value)
        
        return user, company, Token(**tokens)
    
    def login(self, login_data: UserLogin) -> Tuple[User, Token]:
        """Authenticate user and return tokens."""
        user = self.db.query(User).filter(
            and_(User.email == login_data.email, User.is_active == True)
        ).first()
        
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise ValueError("Invalid email or password")
        
        # Create tokens
        tokens = create_tokens(user.id, user.company_id, user.role.value)
        
        return user, Token(**tokens)
    
    def refresh_token(self, refresh_token: str) -> Token:
        """Refresh access token using refresh token."""
        from ..utils.auth import verify_token
        
        payload = verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise ValueError("Invalid refresh token")
        
        user_id = payload.get("user_id")
        company_id = payload.get("company_id")
        role = payload.get("role")
        
        if not all([user_id, company_id, role]):
            raise ValueError("Invalid token payload")
        
        # Verify user still exists and is active
        user = self.db.query(User).filter(
            and_(User.id == user_id, User.is_active == True)
        ).first()
        
        if not user:
            raise ValueError("User not found or inactive")
        
        # Create new tokens
        tokens = create_tokens(user.id, user.company_id, user.role.value)
        
        return Token(**tokens)
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user password."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        if not verify_password(current_password, user.hashed_password):
            raise ValueError("Current password is incorrect")
        
        user.hashed_password = get_password_hash(new_password)
        self.db.commit()
        
        return True
