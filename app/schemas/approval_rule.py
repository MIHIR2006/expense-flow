"""
Pydantic schemas for Approval Rule models.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ApprovalRuleBase(BaseModel):
    """Base approval rule schema."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_manager_approver: bool = True
    is_sequential: bool = False
    min_approval_percentage: int = Field(100, ge=1, le=100)


class ApprovalRuleCreate(ApprovalRuleBase):
    """Schema for creating an approval rule."""
    approvers: List[int] = Field(..., min_items=1)  # List of user IDs
    specific_approver_id: Optional[int] = None


class ApprovalRuleUpdate(BaseModel):
    """Schema for updating an approval rule."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_manager_approver: Optional[bool] = None
    is_sequential: Optional[bool] = None
    min_approval_percentage: Optional[int] = Field(None, ge=1, le=100)
    is_active: Optional[bool] = None


class ApprovalRuleInDB(ApprovalRuleBase):
    """Schema for approval rule in database."""
    id: int
    company_id: int
    specific_approver_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ApprovalRule(ApprovalRuleInDB):
    """Schema for approval rule response."""
    pass


class ApprovalRuleWithApprovers(ApprovalRule):
    """Approval rule with approvers list."""
    approvers: List["ApprovalRuleApprover"] = []


class ApprovalRuleApprover(BaseModel):
    """Schema for approval rule approver."""
    id: int
    sequence_order: int
    approver_id: int
    approver_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ApprovalRuleListResponse(BaseModel):
    """Schema for approval rule list response."""
    rules: List[ApprovalRuleWithApprovers]
    total: int
    page: int
    per_page: int
    total_pages: int
