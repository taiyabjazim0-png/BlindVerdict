from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Rating
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


class ReviewRequest(BaseModel):
    case_id: int
    target_user_id: int
    score: float
    feedback: str = ""


@router.post("")
def submit_review(
    payload: ReviewRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role == "Lawyer":
        rating = Rating(
            case_id=payload.case_id,
            lawyer_id=current_user.id,
            client_id=payload.target_user_id,
            score=payload.score,
            feedback=payload.feedback,
        )
    else:
        rating = Rating(
            case_id=payload.case_id,
            lawyer_id=payload.target_user_id,
            client_id=current_user.id,
            score=payload.score,
            feedback=payload.feedback,
        )
    db.add(rating)
    db.commit()
    return {"status": "ok"}


@router.get("/{case_id}")
def get_reviews(case_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    _ = current_user
    ratings = db.query(Rating).filter(Rating.case_id == case_id).all()
    return [
        {"id": r.id, "score": r.score, "feedback": r.feedback, "lawyer_id": r.lawyer_id, "client_id": r.client_id}
        for r in ratings
    ]
