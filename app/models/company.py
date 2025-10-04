"""
Company model for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db import Base


class Company(Base):
    """Company model."""
    
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    base_currency = Column(String(3), nullable=False)  # ISO currency code
    country_code = Column(String(2), nullable=False)  # ISO country code
    address = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="company")
    expenses = relationship("Expense", back_populates="company")
    approval_rules = relationship("ApprovalRule", back_populates="company")
