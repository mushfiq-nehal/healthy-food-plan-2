# Build stage
FROM python:3.10-slim as builder

# Install uv
RUN pip install uv

WORKDIR /app

# Copy lock file and pyproject.toml
COPY pyproject.toml uv.lock ./

# Create virtual environment and install dependencies using uv
RUN uv venv /opt/venv && \
    . /opt/venv/bin/activate && \
    uv pip install --no-cache-dir \
    alembic \
    coverage \
    fastapi[standard] \
    psycopg2-binary \
    pyjwt \
    pytest \
    sqlmodel

# Runtime stage
FROM python:3.10-slim

# Install necessary system dependencies for psycopg2 and database connectivity
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

WORKDIR /app

# Copy application code
COPY alembic.ini .
COPY app/ ./app/

# Set environment variables
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/', timeout=5)" || exit 1

# Default command - run migrations and start the server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.api.main:app --host 0.0.0.0 --port 8000 --reload"]
