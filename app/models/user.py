"""
User model for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..db import Base


class UserRole(str, enum.Enum):
    """User roles enum."""
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"


class User(Base):
    """User model."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Foreign keys
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="users")
    manager = relationship("User", remote_side=[id], backref="subordinates")
    submitted_expenses = relationship("Expense", back_populates="submitter", foreign_keys="Expense.submitter_id")
    approval_actions = relationship("ApprovalAction", back_populates="approver")
