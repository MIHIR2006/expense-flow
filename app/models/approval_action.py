"""
Approval Action model for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..db import Base


class ApprovalActionStatus(str, enum.Enum):
    """Approval action status enum."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SKIPPED = "skipped"


class ApprovalAction(Base):
    """Approval Action model."""
    
    __tablename__ = "approval_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(ApprovalActionStatus), default=ApprovalActionStatus.PENDING)
    comment = Column(Text, nullable=True)
    sequence_order = Column(Integer, nullable=False)
    acted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign keys
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    expense = relationship("Expense", back_populates="approval_actions")
    approver = relationship("User", back_populates="approval_actions")
