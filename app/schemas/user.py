"""
Pydantic schemas for User model.
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from ..models.user import UserRole


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str
    company_id: int
    manager_id: Optional[int] = None


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    manager_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """Schema for user in database."""
    id: int
    company_id: int
    manager_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserInDB):
    """Schema for user response."""
    pass


class UserWithCompany(User):
    """User with company information."""
    company_name: Optional[str] = None
    manager_name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserSignup(BaseModel):
    """Schema for user signup (first admin)."""
    name: str
    email: EmailStr
    password: str
    country: str