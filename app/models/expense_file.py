"""
Expense File model for SQLAlchemy.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db import Base


class ExpenseFile(Base):
    """Expense File model."""
    
    __tablename__ = "expense_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # S3 path or local path
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    ocr_text = Column(Text, nullable=True)  # OCR extracted text
    is_receipt = Column(Boolean, default=True)
    
    # Foreign keys
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    expense = relationship("Expense", back_populates="files")
