import hashlib
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Case, CaseDocument, User
from app.services.ai_service import AIService
from app.services.dependencies import get_current_user
from app.utils.security import decode_token

router = APIRouter(prefix="/documents", tags=["documents"])
ai_service = AIService()
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_document(
    case_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    raw = await file.read()
    file_hash = hashlib.sha256(raw).hexdigest()
    safe_name = f"{case_id}_{file_hash[:10]}_{file.filename}"
    file_path = UPLOAD_DIR / safe_name
    with open(file_path, "wb") as f:
        f.write(raw)

    content_hint = raw[:2000].decode(errors="ignore")
    ai_result = await ai_service.summarize_and_categorize(file.filename or "Document", content_hint)
    doc = CaseDocument(
        case_id=case_id,
        uploaded_by=current_user.id,
        file_url=str(file_path).replace("\\", "/"),
        original_name=file.filename,
        hash=file_hash,
        summary=ai_result["summary"],
        category=ai_result.get("category", "General"),
        tags=",".join(ai_result.get("tags", [])),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {
        "id": doc.id,
        "case_id": doc.case_id,
        "file_url": doc.file_url,
        "original_name": doc.original_name,
        "hash": doc.hash,
        "summary": doc.summary,
        "category": doc.category,
        "tags": doc.tags.split(",") if doc.tags else [],
    }


@router.get("/{case_id}")
def list_documents(case_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.role == "Client" and case.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if current_user.role == "Lawyer" and case.lawyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    docs = db.query(CaseDocument).filter(CaseDocument.case_id == case_id).order_by(CaseDocument.uploaded_at).all()
    return [
        {
            "id": d.id,
            "file_url": d.file_url,
            "original_name": d.original_name or d.file_url.split("/")[-1],
            "hash": d.hash,
            "summary": d.summary,
            "category": d.category or "General",
            "tags": d.tags.split(",") if d.tags else [],
            "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at else None,
        }
        for d in docs
    ]


@router.get("/download/{doc_id}")
def download_document(doc_id: int, token: str = Query(None), db: Session = Depends(get_db)):
    current_user = None
    if token:
        payload = decode_token(token)
        if payload:
            current_user = db.query(User).filter(User.id == int(payload.get("sub", 0))).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    doc = db.query(CaseDocument).filter(CaseDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    case = db.query(Case).filter(Case.id == doc.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.role == "Client" and case.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if current_user.role == "Lawyer" and case.lawyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    file_path = Path(doc.file_url.replace("/", "\\") if "\\" in doc.file_url else doc.file_url)
    if not file_path.exists():
        file_path = UPLOAD_DIR / file_path.name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    return FileResponse(str(file_path), filename=doc.original_name or file_path.name)
