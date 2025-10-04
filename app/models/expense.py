"""
Expense model for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Numeric, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..db import Base


class ExpenseStatus(str, enum.Enum):
    """Expense status enum."""
    SUBMITTED = "submitted"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"


class ExpenseCategory(str, enum.Enum):
    """Expense category enum."""
    TRAVEL = "travel"
    MEALS = "meals"
    ACCOMMODATION = "accommodation"
    TRANSPORT = "transport"
    OFFICE_SUPPLIES = "office_supplies"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"


class Expense(Base):
    """Expense model."""
    
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False)  # ISO currency code
    amount_in_base = Column(Numeric(10, 2), nullable=False)  # Amount in company's base currency
    exchange_rate_to_base = Column(Numeric(10, 6), nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False)
    description = Column(Text, nullable=False)
    expense_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(ExpenseStatus), default=ExpenseStatus.SUBMITTED)
    
    # Foreign keys
    submitter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    submitter = relationship("User", back_populates="submitted_expenses", foreign_keys=[submitter_id])
    company = relationship("Company", back_populates="expenses")
    files = relationship("ExpenseFile", back_populates="expense")
    approval_actions = relationship("ApprovalAction", back_populates="expense")
    audit_logs = relationship("AuditLog", back_populates="expense")
