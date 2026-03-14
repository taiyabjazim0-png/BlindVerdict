from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Lawyer, User
from app.schemas.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.utils.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()

    if payload.role == "Lawyer":
        if not payload.bar_council_id or not payload.specialization:
            raise HTTPException(status_code=400, detail="Lawyer fields are required")
        lawyer = Lawyer(
            user_id=user.id,
            bar_id=payload.bar_council_id,
            specialization=payload.specialization,
            experience_years=payload.years_of_experience or 0,
        )
        db.add(lawyer)

    db.commit()
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return AuthResponse(access_token=token, role=user.role, user_id=user.id, name=user.name)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return AuthResponse(access_token=token, role=user.role, user_id=user.id, name=user.name)
