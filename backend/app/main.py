"""
FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import create_tables

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to Expense Flow API"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Include API routes
# from .routes import auth, expenses, users
# app.include_router(auth.router, prefix=f"{settings.api_v1_prefix}/auth", tags=["authentication"])
# app.include_router(expenses.router, prefix=f"{settings.api_v1_prefix}/expenses", tags=["expenses"])
# app.include_router(users.router, prefix=f"{settings.api_v1_prefix}/users", tags=["users"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
