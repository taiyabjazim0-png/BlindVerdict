from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Case, CaseDocument, CaseLog, Message
from app.schemas.schemas import AIChatRequest, AnalyzeRequest, AnalyzeResponse, TimelineRequest
from app.services.ai_service import AIService
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])
ai_service = AIService()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_issue(payload: AnalyzeRequest):
    result = await ai_service.analyze_issue(payload.description, payload.language)
    return AnalyzeResponse(**result)


@router.post("/timeline")
async def generate_timeline(payload: TimelineRequest):
    events = await ai_service.generate_timeline(payload.description)
    return {"events": events}


@router.post("/summarize")
async def summarize_document(payload: dict):
    file_name = payload.get("file_name", "Document")
    content_hint = payload.get("content_hint", "")
    result = await ai_service.summarize_and_categorize(file_name, content_hint)
    return result


@router.post("/chat")
async def ai_case_chat(
    payload: AIChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(Case.id == payload.case_id).first()
    if not case:
        return {"answer": "Case not found."}

    docs = db.query(CaseDocument).filter(CaseDocument.case_id == payload.case_id).all()
    doc_summaries = [f"{d.original_name or 'Document'}: {d.summary}" for d in docs if d.summary]

    logs = db.query(CaseLog).filter(CaseLog.case_id == payload.case_id).order_by(CaseLog.created_at).all()
    log_texts = [l.message for l in logs]

    answer = await ai_service.case_chat(payload.question, case.description, doc_summaries, log_texts)
    return {"answer": answer}


@router.post("/summarize-messages")
async def summarize_messages(
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case_id = payload.get("case_id", 0)
    msgs = db.query(Message).filter(Message.case_id == case_id).order_by(Message.created_at).all()
    client_msgs = [m.content for m in msgs if m.sender_id != current_user.id]
    summary = await ai_service.summarize_client_details(client_msgs if client_msgs else [m.content for m in msgs])
    return {"summary": summary}
