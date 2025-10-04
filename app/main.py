"""
FastAPI application entry point.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from .config import get_settings
from .db import create_tables
from .routes import (
    auth_router, users_router, expenses_router, 
    approval_rules_router, admin_router
)
from .utils.external_apis import cleanup_apis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting up Expense Flow API...")
    create_tables()
    yield
    # Shutdown
    logger.info("Shutting down Expense Flow API...")
    await cleanup_apis()


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Expense Flow API",
        "version": settings.version,
        "docs": "/docs" if settings.debug else "Documentation not available in production"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.version,
        "debug": settings.debug
    }


# Include API routes
app.include_router(
    auth_router, 
    prefix=f"{settings.api_v1_prefix}/auth", 
    tags=["Authentication"]
)

app.include_router(
    users_router, 
    prefix=f"{settings.api_v1_prefix}/users", 
    tags=["User Management"]
)

app.include_router(
    expenses_router, 
    prefix=f"{settings.api_v1_prefix}/expenses", 
    tags=["Expense Management"]
)

app.include_router(
    approval_rules_router, 
    prefix=f"{settings.api_v1_prefix}/rules", 
    tags=["Approval Rules"]
)

app.include_router(
    admin_router, 
    prefix=f"{settings.api_v1_prefix}/admin", 
    tags=["Admin Functions"]
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=settings.debug
    )
