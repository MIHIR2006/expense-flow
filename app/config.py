"""
Configuration settings for the FastAPI application.
"""
import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application settings
    app_name: str = "Expense Flow API"
    debug: bool = True
    version: str = "1.0.0"
    
    # Database settings
    database_url: str = "sqlite:///./expense_flow.db"
    database_url_test: str = "sqlite:///./test_expense_flow.db"
    
    # Security settings
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # CORS settings
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # API settings
    api_v1_prefix: str = "/api/v1"
    
    # External APIs
    restcountries_api_url: str = "https://restcountries.com/v3.1"
    exchange_rate_api_url: str = "https://api.exchangerate-api.com/v4/latest"
    exchange_rate_api_key: Optional[str] = None
    
    # File storage
    upload_dir: str = "./uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: List[str] = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
    
    # AWS S3 (optional)
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "us-east-1"
    s3_bucket_name: Optional[str] = None
    
    # Email settings
    smtp_server: Optional[str] = None
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True
    
    # OCR settings
    ocr_enabled: bool = False
    ocr_api_key: Optional[str] = None
    ocr_api_url: Optional[str] = None
    
    # Redis (for caching)
    redis_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
