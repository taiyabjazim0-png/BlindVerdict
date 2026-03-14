import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


_DEFAULT_DB = f"sqlite:///{Path(__file__).resolve().parent.parent.parent / 'blindverdict.db'}"
DATABASE_URL = os.getenv("DATABASE_URL", _DEFAULT_DB)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
