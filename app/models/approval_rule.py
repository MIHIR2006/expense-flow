"""
Approval Rule models for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..db import Base


class ApprovalRule(Base):
    """Approval Rule model."""
    
    __tablename__ = "approval_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_manager_approver = Column(Boolean, default=True)
    is_sequential = Column(Boolean, default=False)
    min_approval_percentage = Column(Integer, default=100)  # Percentage of approvers needed
    is_active = Column(Boolean, default=True)
    
    # Foreign keys
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    specific_approver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="approval_rules")
    specific_approver = relationship("User")
    rule_approvers = relationship("ApprovalRuleApprover", back_populates="rule", cascade="all, delete-orphan")


class ApprovalRuleApprover(Base):
    """Approval Rule Approver model."""
    
    __tablename__ = "approval_rule_approvers"
    
    id = Column(Integer, primary_key=True, index=True)
    sequence_order = Column(Integer, nullable=False)
    
    # Foreign keys
    rule_id = Column(Integer, ForeignKey("approval_rules.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    rule = relationship("ApprovalRule", back_populates="rule_approvers")
    approver = relationship("User")
