"""
Pydantic schemas for Company model.
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class CompanyBase(BaseModel):
    """Base company schema."""
    name: str
    base_currency: str
    country_code: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class CompanyCreate(CompanyBase):
    """Schema for creating a company."""
    pass


class CompanyUpdate(BaseModel):
    """Schema for updating a company."""
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class CompanyInDB(CompanyBase):
    """Schema for company in database."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Company(CompanyInDB):
    """Schema for company response."""
    pass


class CompanyWithStats(Company):
    """Company with statistics."""
    total_users: int = 0
    total_expenses: int = 0
    pending_expenses: int = 0
