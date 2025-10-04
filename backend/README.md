# Expense Flow Backend

A FastAPI-based backend for the Expense Flow application.

## Project Structure

```
backend/
├── app/                   # Main application package
│   ├── __init__.py
│   ├── main.py            # FastAPI entry point
│   ├── config.py          # Configuration settings
│   ├── db.py              # Database connection
│   ├── models/            # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/           # Pydantic schemas
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routes/            # API routes
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── services/          # Business logic
│   │   ├── __init__.py
│   │   └── user_service.py
│   └── utils/             # Helper functions
│       ├── __init__.py
│       └── auth.py
├── tests/                 # Test suite (outside app/)
│   └── __init__.py
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables example
└── README.md
```

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Run the application:**
   ```bash
   # Development mode
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Or run directly
   python -m app.main
   ```

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/token` - User login
- `GET /api/v1/auth/me` - Get current user

## Features

- **FastAPI** for high-performance API development
- **SQLAlchemy** for database ORM
- **Pydantic** for data validation
- **JWT** authentication
- **CORS** support
- **Environment-based configuration**
- **Modular architecture** with separation of concerns

## Development

The project follows a clean architecture pattern:

- **Models**: SQLAlchemy database models
- **Schemas**: Pydantic models for request/response validation
- **Routes**: API endpoint handlers
- **Services**: Business logic layer
- **Utils**: Helper functions and utilities
- **Config**: Application configuration
