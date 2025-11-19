import os
from sqlmodel import create_engine, Session
from typing import Generator

from dotenv import load_dotenv

load_dotenv()

# Database URL from environment variable or default SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database.db")

# Create engine with appropriate settings
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    # For PostgreSQL or other databases
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True
    )


def get_session() -> Generator[Session, None, None]:
    """
    Dependency function to get a database session.
    
    Usage in FastAPI routes:
        @app.get("/users")
        def get_users(session: Session = Depends(get_session)):
            users = session.query(User).all()
            return users
    
    Usage in other files:
        session = next(get_session())
        # Use session to query/write data
        session.close()
    """
    with Session(engine) as session:
        yield session
