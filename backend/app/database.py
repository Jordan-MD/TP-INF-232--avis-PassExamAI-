from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_DB = f"sqlite:///{os.path.join(BASE_DIR, 'survey.db')}"
DATABASE_URL = os.getenv("DATABASE_URL", LOCAL_DB)

engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    engine_args = {"check_same_thread": False}

# Ajuste si besoin (Docker persistent)
engine = create_engine(
    DATABASE_URL,
    connect_args=engine_args,
    pool_pre_ping=True,    # évite "connection is closed"
    pool_recycle=1800,     # recycle connexions (30 min)
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=True)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()