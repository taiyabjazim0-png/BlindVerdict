from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Case, Message
from app.schemas.schemas import MessageCreate
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("")
def send_message(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(Case.id == payload.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.id not in (case.client_id, case.lawyer_id):
        raise HTTPException(status_code=403, detail="Access denied")

    msg = Message(
        case_id=payload.case_id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        content=payload.content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {
        "id": msg.id,
        "case_id": msg.case_id,
        "sender_id": msg.sender_id,
        "sender_name": msg.sender_name,
        "content": msg.content,
        "created_at": msg.created_at.isoformat(),
    }


@router.get("/{case_id}")
def list_messages(
    case_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.id not in (case.client_id, case.lawyer_id):
        raise HTTPException(status_code=403, detail="Access denied")

    msgs = db.query(Message).filter(Message.case_id == case_id).order_by(Message.created_at).all()
    return [
        {
            "id": m.id,
            "case_id": m.case_id,
            "sender_id": m.sender_id,
            "sender_name": m.sender_name,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
        }
        for m in msgs
    ]
