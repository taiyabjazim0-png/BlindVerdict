from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(160), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)

    lawyer_profile = relationship("Lawyer", back_populates="user", uselist=False)


class Lawyer(Base):
    __tablename__ = "lawyers"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    bar_id = Column(String(80), nullable=False)
    specialization = Column(String(120), nullable=False)
    experience_years = Column(Integer, nullable=False, default=0)
    rating = Column(Float, nullable=False, default=4.2)
    bio = Column(Text, nullable=False, default="Experienced legal professional.")
    price_range = Column(String(50), nullable=False, default="₹15,000 - ₹50,000")
    cases_handled = Column(Integer, nullable=False, default=0)
    city = Column(String(80), nullable=True)
    state = Column(String(80), nullable=True)

    user = relationship("User", back_populates="lawyer_profile")


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(160), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="Pending")
    expected_budget = Column(String(80), nullable=True)
    next_hearing_date = Column(String(40), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class CaseDocument(Base):
    __tablename__ = "case_documents"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    file_url = Column(String(400), nullable=False)
    original_name = Column(String(255), nullable=True)
    hash = Column(String(128), nullable=False)
    summary = Column(Text, nullable=True)
    category = Column(String(80), nullable=True)
    tags = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class CaseLog(Base):
    __tablename__ = "case_logs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender_name = Column(String(120), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False, default=5.0)
    feedback = Column(Text, nullable=True)
