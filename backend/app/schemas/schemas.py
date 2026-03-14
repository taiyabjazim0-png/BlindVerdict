from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    bar_council_id: Optional[str] = None
    specialization: Optional[str] = None
    years_of_experience: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    name: str


class AnalyzeRequest(BaseModel):
    description: str
    language: str = "English"


class AnalyzeResponse(BaseModel):
    legal_category: str
    complexity: str
    lawyer_required: bool
    steps: Optional[list[str]] = None


class TimelineRequest(BaseModel):
    description: str


class TimelineEvent(BaseModel):
    title: str
    detail: str
    day: str


class CaseCreateRequest(BaseModel):
    title: str
    description: str
    lawyer_id: Optional[int] = None
    expected_budget: Optional[str] = None


class CaseUpdateRequest(BaseModel):
    status: Optional[str] = None
    lawyer_id: Optional[int] = None
    next_hearing_date: Optional[str] = None


class CaseResponse(BaseModel):
    id: int
    client_id: int
    lawyer_id: Optional[int]
    title: str
    description: str
    status: str
    created_at: datetime
    expected_budget: Optional[str] = None
    next_hearing_date: Optional[str] = None

    class Config:
        from_attributes = True


class ResearchRequest(BaseModel):
    case_id: int
    query: str


class AIChatRequest(BaseModel):
    case_id: int
    question: str


class MessageCreate(BaseModel):
    case_id: int
    content: str
