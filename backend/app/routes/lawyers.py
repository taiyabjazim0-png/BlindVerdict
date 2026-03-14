from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Lawyer, User

router = APIRouter(prefix="/lawyers", tags=["lawyers"])


@router.get("")
def list_lawyers(db: Session = Depends(get_db)):
    rows = db.query(Lawyer, User).join(User, Lawyer.user_id == User.id).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "specialization": lawyer.specialization,
            "experience": lawyer.experience_years,
            "rating": lawyer.rating,
            "price_range": lawyer.price_range,
            "city": lawyer.city,
            "state": lawyer.state,
        }
        for lawyer, user in rows
    ]


@router.get("/{lawyer_id}")
def get_lawyer(lawyer_id: int, db: Session = Depends(get_db)):
    row = db.query(Lawyer, User).join(User, Lawyer.user_id == User.id).filter(User.id == lawyer_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    lawyer, user = row
    return {
        "id": user.id,
        "name": user.name,
        "specialization": lawyer.specialization,
        "experience": lawyer.experience_years,
        "rating": lawyer.rating,
        "price_range": lawyer.price_range,
        "bio": lawyer.bio,
        "cases_handled": lawyer.cases_handled,
        "city": lawyer.city,
        "state": lawyer.state,
    }
