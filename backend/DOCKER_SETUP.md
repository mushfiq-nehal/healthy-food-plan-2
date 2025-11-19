# Backend Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- Or locally: Python 3.10+, uv package manager

## Quick Start with Docker

### 1. Copy environment variables
```bash
cp .env.example .env
```

### 2. Build and run with Docker Compose
```bash
docker-compose up --build
```

The backend will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3. Stop the services
```bash
docker-compose down
```

---

## Local Development Setup

### 1. Install dependencies with uv
```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r pyproject.toml
```

### 2. Setup environment variables
```bash
cp .env.example .env
```
Update `.env` with your local PostgreSQL credentials or use SQLite for development.

### 3. Run database migrations
```bash
alembic upgrade head
```

### 4. Start the development server
```bash
uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Docker Compose Services

### PostgreSQL Database
- Container: `healthy-food-plan-db`
- Port: `5432` (accessible as `localhost:5432`)
- Default credentials in `.env`

### FastAPI Backend
- Container: `healthy-food-plan-backend`
- Port: `8000`
- Automatically runs migrations on startup
- Hot-reload enabled for development

---

## Useful Commands

### Docker Commands
```bash
# View logs
docker-compose logs backend
docker-compose logs postgres

# Run a command in the backend container
docker-compose exec backend bash

# Restart services
docker-compose restart

# Remove everything and start fresh
docker-compose down -v
docker-compose up --build
```

### Database Commands
```bash
# Create a new migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Rollback to previous migration
alembic downgrade -1
```

### Testing
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

---

## Environment Variables

See `.env.example` for all available variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key (change in production)
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Access token TTL
- `REFRESH_TOKEN_EXPIRE_DAYS` - Refresh token TTL

---

## API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## Troubleshooting

### Port already in use
Change the port in `.env`:
```bash
BACKEND_PORT=8001
```

### Database connection issues
Ensure PostgreSQL is running and credentials match `.env`:
```bash
docker-compose logs postgres
```

### Migrations failing
Check if the database exists and is accessible:
```bash
docker-compose exec postgres psql -U postgres -d healthy_food_plan -c "\dt"
```

### Clear everything and restart
```bash
docker-compose down -v
docker-compose up --build
```
