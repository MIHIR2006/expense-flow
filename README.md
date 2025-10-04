# Expense Flow Backend

A comprehensive FastAPI-based backend for expense management with approval workflows, multi-currency support, and role-based access control.

## 🚀 Features

- **Multi-Company Support**: Each company has its own base currency and users
- **Role-Based Access Control**: Admin, Manager, and Employee roles with different permissions
- **Expense Management**: Submit, track, and manage expenses with file attachments
- **Approval Workflows**: Configurable approval rules with sequential and parallel approval
- **Multi-Currency Support**: Automatic currency conversion using external APIs
- **File Management**: Receipt upload and OCR text extraction
- **Audit Logging**: Complete audit trail for all actions
- **External API Integration**: Country data and exchange rate APIs
- **JWT Authentication**: Secure token-based authentication with refresh tokens

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI entry point
│   ├── config.py                  # Configuration settings
│   ├── db.py                      # Database connection
│   ├── models/                    # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py               # User and UserRole models
│   │   ├── company.py            # Company model
│   │   ├── expense.py            # Expense and related models
│   │   ├── approval_rule.py      # Approval rule models
│   │   ├── approval_action.py    # Approval action model
│   │   ├── expense_file.py       # File attachment model
│   │   └── audit_log.py          # Audit logging model
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py               # User schemas
│   │   ├── company.py            # Company schemas
│   │   ├── expense.py            # Expense schemas
│   │   ├── approval_rule.py      # Approval rule schemas
│   │   ├── auth.py               # Authentication schemas
│   │   └── common.py             # Common schemas
│   ├── routes/                    # API routes
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication endpoints
│   │   ├── users.py              # User management endpoints
│   │   ├── expenses.py           # Expense management endpoints
│   │   ├── approval_rules.py     # Approval rule endpoints
│   │   └── admin.py              # Admin functions
│   ├── services/                  # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py       # Authentication service
│   │   ├── user_service.py       # User management service
│   │   ├── expense_service.py    # Expense management service
│   │   └── approval_rule_service.py # Approval rule service
│   └── utils/                     # Helper functions
│       ├── __init__.py
│       ├── auth.py               # Authentication utilities
│       ├── rbac.py               # Role-based access control
│       ├── external_apis.py      # External API clients
│       └── file_storage.py       # File storage utilities
├── tests/                         # Test suite
│   └── __init__.py
├── requirements.txt               # Python dependencies
├── env.example                   # Environment variables example
├── .gitignore                    # Git ignore rules
└── README.md
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Application settings
APP_NAME="Expense Flow API"
DEBUG=true
VERSION="1.0.0"

# Database settings
DATABASE_URL="sqlite:///./expense_flow.db"

# Security settings
SECRET_KEY="your-secret-key-change-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS settings
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# External APIs
RESTCOUNTRIES_API_URL="https://restcountries.com/v3.1"
EXCHANGE_RATE_API_URL="https://api.exchangerate-api.com/v4/latest"
EXCHANGE_RATE_API_KEY="your-api-key"

# File storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=["image/jpeg", "image/png", "image/gif", "application/pdf"]

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="your-bucket"

# Email settings (optional)
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=587
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-password"
SMTP_USE_TLS=true

# OCR settings (optional)
OCR_ENABLED=false
OCR_API_KEY="your-ocr-api-key"
OCR_API_URL="https://api.ocr.space/parse/image"
```

### 3. Run the Application

```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs (in debug mode)
- **ReDoc**: http://localhost:8000/redoc (in debug mode)

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create company and admin user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/change-password` - Change password

### User Management
- `POST /api/v1/users/` - Create user (admin only)
- `GET /api/v1/users/` - List users
- `GET /api/v1/users/{user_id}` - Get user details
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Deactivate user (admin only)
- `GET /api/v1/users/managers/list` - List managers (admin only)
- `GET /api/v1/users/employees/{manager_id}` - List employees under manager

### Expense Management
- `POST /api/v1/expenses/` - Submit expense
- `GET /api/v1/expenses/{expense_id}` - Get expense details
- `GET /api/v1/expenses/` - List expenses with filtering
- `POST /api/v1/expenses/{expense_id}/action` - Approve/reject expense
- `POST /api/v1/expenses/{expense_id}/attach-receipt` - Attach receipt
- `GET /api/v1/expenses/statistics/summary` - Get expense statistics

### Approval Rules
- `POST /api/v1/rules/` - Create approval rule (admin only)
- `GET /api/v1/rules/` - List approval rules
- `GET /api/v1/rules/{rule_id}` - Get approval rule details
- `PUT /api/v1/rules/{rule_id}` - Update approval rule (admin only)
- `DELETE /api/v1/rules/{rule_id}` - Deactivate rule (admin only)

### Admin Functions
- `POST /api/v1/admin/override/{expense_id}` - Admin override (admin only)
- `GET /api/v1/admin/audit-logs` - Get audit logs (admin only)
- `GET /api/v1/admin/company-stats` - Get company statistics (admin only)

## 🔄 Core Flows

### 1. Signup (First User)
1. User provides: name, email, password, country
2. System calls RestCountries API to get currency code
3. Creates company with base currency
4. Creates admin user with company_id
5. Returns JWT tokens

### 2. Admin Actions
1. Create users (employee/manager) with manager assignments
2. Create approval rules with approvers and sequence
3. Set approval policies (sequential, percentage, specific approver)

### 3. Employee Submits Expense
1. Upload expense details and receipt files
2. System stores files and creates file records
3. Calls exchange rate API for currency conversion
4. Creates expense with status 'submitted'
5. Instantiates approval actions based on rules
6. Notifies first approvers

### 4. Approver Actions
1. Approver reviews expense and takes action
2. System validates permissions and sequence
3. Updates approval action status
4. Evaluates overall approval status
5. Creates audit log and triggers notifications

### 5. Finalization
1. When approved/rejected, expense status is updated
2. Optional: Create payout or send to finance queue
3. Complete audit trail maintained

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions based on user roles
- **Company Isolation**: Users can only access their company's data
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Protection**: Configurable CORS settings
- **Input Validation**: Pydantic schemas for request validation
- **Audit Logging**: Complete audit trail for compliance

## 🌍 Multi-Currency Support

- **Automatic Conversion**: Real-time exchange rate conversion
- **Base Currency**: Each company has a base currency
- **Exchange Rate Caching**: 1-hour cache for performance
- **Fallback Handling**: Graceful handling of API failures

## 📁 File Management

- **Multiple Formats**: Support for images and PDFs
- **File Validation**: Size and type validation
- **Storage Options**: Local storage or AWS S3
- **OCR Integration**: Optional text extraction from receipts

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DEBUG=false
DATABASE_URL="postgresql://user:password@localhost/expense_flow"
SECRET_KEY="your-production-secret-key"
ALLOWED_ORIGINS=["https://yourdomain.com"]
```

## 📝 Development

The project follows clean architecture principles:

- **Models**: SQLAlchemy database models
- **Schemas**: Pydantic models for validation
- **Routes**: API endpoint handlers
- **Services**: Business logic layer
- **Utils**: Helper functions and external integrations
- **Config**: Environment-based configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.