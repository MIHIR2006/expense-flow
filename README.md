# Expense Flow

A modern expense management application built with FastAPI and Next.js, designed to streamline expense tracking, approval workflows, and financial reporting for teams and organizations.

## Features

- **User Authentication & Authorization**: Secure login/signup with JWT tokens
- **Expense Management**: Create, edit, and track expenses with categories and receipts
- **Approval Workflows**: Multi-level approval system for expense claims
- **Dashboard Analytics**: Visual insights into spending patterns and trends
- **Responsive Design**: Mobile-first approach with modern UI components
- **Real-time Updates**: Live notifications and status updates
- **Export Capabilities**: Generate reports in multiple formats

## Tech Stack

### Frontend
[![My Skills](https://skillicons.dev/icons?i=nextjs,react,typescript,tailwindcss,html,css)](https://skillicons.dev)

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
[![My Skills](https://skillicons.dev/icons?i=python,fastapi,sqlalchemy,alembic,pytest)](https://skillicons.dev)

- **Python 3.8+** - Core programming language
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **Pytest** - Testing framework
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing


### Development Tools
[![My Skills](https://skillicons.dev/icons?i=git,github,vscode,nodejs,npm)](https://skillicons.dev)

- **Git** - Version control
- **GitHub** - Code repository hosting
- **VS Code** - Development environment
- **Node.js** - JavaScript runtime
- **npm** - Package manager

## Project Structure

```
expense-flow/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── tests/              # Test files
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/               # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── public/            # Static assets
└── readme.md              # Project documentation
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 18.0 or higher
- npm 8.0 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Available Scripts

### Backend
- `uvicorn app.main:app --reload` - Start development server
- `pytest` - Run tests
- `alembic upgrade head` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test:all` - Run all checks and tests

## Environment Variables

### Backend (.env)
```env
# Application
APP_NAME=Expense Flow API
DEBUG=False
VERSION=1.0.0

# Database
DATABASE_URL=sqlite:///./expense_flow.db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm run test:all
```

## Deployment

### Backend Deployment
The FastAPI application can be deployed using:
- Docker
- Heroku
- Railway
- DigitalOcean App Platform
- AWS/GCP/Azure

### Frontend Deployment
The Next.js application is configured for static export and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/MIHIR2006/expense-flow/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

## Roadmap

- [ ] Advanced reporting features
- [ ] Integration with accounting software
- [ ] Multi-currency support
- [ ] Advanced approval workflows
- [ ] API rate limiting
- [ ] Caching layer (Redis)
- [ ] Background job processing