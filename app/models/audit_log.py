"""
Audit Log model for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..db import Base


class AuditAction(str, enum.Enum):
    """Audit action enum."""
    EXPENSE_SUBMITTED = "expense_submitted"
    EXPENSE_APPROVED = "expense_approved"
    EXPENSE_REJECTED = "expense_rejected"
    EXPENSE_OVERRIDE = "expense_override"
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    RULE_CREATED = "rule_created"
    RULE_UPDATED = "rule_updated"


class AuditLog(Base):
    """Audit Log model."""
    
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(Enum(AuditAction), nullable=False)
    description = Column(Text, nullable=False)
    old_values = Column(Text, nullable=True)  # JSON string
    new_values = Column(Text, nullable=True)  # JSON string
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    expense = relationship("Expense", back_populates="audit_logs")
