"""
Common schemas used across the application.
"""
from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime


class MessageResponse(BaseModel):
    """Standard message response."""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """Error response schema."""
    error: str
    detail: Optional[str] = None
    success: bool = False


class PaginationParams(BaseModel):
    """Pagination parameters."""
    page: int = 1
    per_page: int = 20
    sort_by: Optional[str] = None
    sort_order: str = "desc"  # asc or desc


class PaginatedResponse(BaseModel):
    """Paginated response schema."""
    items: list
    total: int
    page: int
    per_page: int
    total_pages: int
    has_next: bool
    has_prev: bool


class FileUploadResponse(BaseModel):
    """File upload response schema."""
    filename: str
    file_path: str
    file_size: int
    mime_type: str
    success: bool = True


class CountryInfo(BaseModel):
    """Country information schema."""
    name: str
    code: str
    currency: str
    currency_symbol: str


class ExchangeRate(BaseModel):
    """Exchange rate schema."""
    from_currency: str
    to_currency: str
    rate: float
    date: datetime


class ResponseModel(BaseModel):
    """Generic response model."""
    success: bool
    message: str
    data: Optional[Any] = None