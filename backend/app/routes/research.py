from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import CaseDocument
from app.schemas.schemas import ResearchRequest
from app.services.ai_service import AIService
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/research", tags=["research"])
ai_service = AIService()


@router.post("")
def research_documents(
    payload: ResearchRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _ = current_user
    docs = db.query(CaseDocument).filter(CaseDocument.case_id == payload.case_id).all()
    doc_data = [
        {"file_url": d.file_url, "summary": d.summary or "", "tags": d.tags or ""}
        for d in docs
    ]
    results = ai_service.search_documents(payload.query, doc_data)
    return {"results": results}
