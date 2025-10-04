"""
Configuration settings for the FastAPI application.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application settings
    app_name: str = "Expense Flow API"
    debug: bool = False
    version: str = "1.0.0"
    
    # Database settings
    database_url: str = "sqlite:///./expense_flow.db"
    database_url_test: str = "sqlite:///./test_expense_flow.db"
    
    # Security settings
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS settings
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # API settings
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
