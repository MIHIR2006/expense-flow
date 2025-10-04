"""
Pydantic schemas for Expense model.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from ..models.expense import ExpenseStatus, ExpenseCategory


class ExpenseBase(BaseModel):
    """Base expense schema."""
    amount: Decimal = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    category: ExpenseCategory
    description: str = Field(..., min_length=1, max_length=1000)
    expense_date: datetime
    
    class Config:
        from_attributes = True


class ExpenseFile(BaseModel):
    """Schema for expense file."""
    id: int
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    is_receipt: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ExpenseCreate(ExpenseBase):
    """Schema for creating an expense."""
    pass


class ExpenseUpdate(BaseModel):
    """Schema for updating an expense."""
    amount: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    category: Optional[ExpenseCategory] = None
    description: Optional[str] = Field(None, min_length=1, max_length=1000)
    expense_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ExpenseInDB(ExpenseBase):
    """Schema for expense in database."""
    id: int
    amount_in_base: Decimal
    exchange_rate_to_base: Decimal
    status: ExpenseStatus
    submitter_id: int
    company_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ApprovalAction(BaseModel):
    """Schema for approval action."""
    id: int
    status: str
    comment: Optional[str] = None
    sequence_order: int
    acted_at: Optional[datetime] = None
    approver_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class Expense(ExpenseInDB):
    """Schema for expense response."""
    pass


class ExpenseWithDetails(Expense):
    """Expense with additional details."""
    submitter_name: Optional[str] = None
    company_name: Optional[str] = None
    files: List["ExpenseFile"] = []
    approval_actions: List["ApprovalAction"] = []


class ExpenseAction(BaseModel):
    """Schema for expense approval/rejection action."""
    action: str = Field(..., pattern="^(approve|reject)$")
    comment: Optional[str] = Field(None, max_length=500)


class ExpenseListResponse(BaseModel):
    """Schema for expense list response."""
    expenses: List[ExpenseWithDetails]
    total: int
    page: int
    per_page: int
    total_pages: int




