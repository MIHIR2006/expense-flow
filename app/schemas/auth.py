"""
Authentication schemas.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Token data schema."""
    user_id: Optional[int] = None
    company_id: Optional[int] = None
    role: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request schema."""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset schema."""
    token: str
    new_password: str


class ChangePassword(BaseModel):
    """Change password schema."""
    current_password: str
    new_password: str