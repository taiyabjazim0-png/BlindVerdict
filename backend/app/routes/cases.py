from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Case, CaseLog, User
from app.schemas.schemas import CaseCreateRequest, CaseResponse, CaseUpdateRequest
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("", response_model=CaseResponse)
def create_case(
    payload: CaseCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = Case(
        client_id=current_user.id,
        lawyer_id=payload.lawyer_id,
        title=payload.title,
        description=payload.description,
        status="Pending",
        expected_budget=payload.expected_budget,
    )
    db.add(case)
    db.flush()
    db.add(CaseLog(case_id=case.id, message="Case request created by client"))
    db.commit()
    db.refresh(case)
    return case


@router.get("")
def list_cases(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    query = db.query(Case)
    if current_user.role == "Client":
        query = query.filter(Case.client_id == current_user.id)
    elif current_user.role == "Lawyer":
        query = query.filter(Case.lawyer_id == current_user.id)
    cases = query.order_by(Case.created_at.desc()).all()
    result = []
    for c in cases:
        client = db.query(User).filter(User.id == c.client_id).first()
        lawyer = db.query(User).filter(User.id == c.lawyer_id).first() if c.lawyer_id else None
        result.append({
            "id": c.id,
            "client_id": c.client_id,
            "client_name": client.name if client else "Unknown",
            "lawyer_id": c.lawyer_id,
            "lawyer_name": lawyer.name if lawyer else None,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "expected_budget": c.expected_budget,
            "next_hearing_date": c.next_hearing_date,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })
    return result


@router.patch("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int,
    payload: CaseUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if payload.status:
        case.status = payload.status
        db.add(CaseLog(case_id=case.id, message=f"Case status updated to {payload.status}"))
    if payload.lawyer_id:
        case.lawyer_id = payload.lawyer_id
    elif current_user.role == "Lawyer" and payload.status == "Accepted":
        case.lawyer_id = current_user.id
    if payload.next_hearing_date is not None:
        case.next_hearing_date = payload.next_hearing_date
        db.add(CaseLog(case_id=case.id, message=f"Next hearing date set to {payload.next_hearing_date}"))

    db.commit()
    db.refresh(case)
    return case
