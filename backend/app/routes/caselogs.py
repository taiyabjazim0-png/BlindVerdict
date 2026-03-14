from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import CaseLog
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/caselogs", tags=["caselogs"])


@router.get("/{case_id}")
def get_case_logs(case_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    _ = current_user
    logs = db.query(CaseLog).filter(CaseLog.case_id == case_id).order_by(CaseLog.created_at.desc()).all()
    return [
        {"id": l.id, "message": l.message, "created_at": l.created_at.isoformat()}
        for l in logs
    ]
