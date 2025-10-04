"""
Authentication routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..schemas.user import User, UserSignup, UserLogin
from ..schemas.auth import Token, RefreshTokenRequest, ChangePassword
from ..schemas.common import MessageResponse
from ..services.auth_service import AuthService
from ..utils.rbac import get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/signup", response_model=Token)
async def signup(signup_data: UserSignup, db: Session = Depends(get_db)):
    """Create company and admin user (first user signup)."""
    try:
        auth_service = AuthService(db)
        user, company, tokens = await auth_service.signup(signup_data)
        return tokens
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token."""
    try:
        auth_service = AuthService(db)
        user, tokens = auth_service.login(login_data)
        return tokens
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using refresh token."""
    try:
        auth_service = AuthService(db)
        tokens = auth_service.refresh_token(refresh_data.refresh_token)
        return tokens
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password."""
    try:
        auth_service = AuthService(db)
        auth_service.change_password(
            current_user.id,
            password_data.current_password,
            password_data.new_password
        )
        return MessageResponse(message="Password changed successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Change password error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
