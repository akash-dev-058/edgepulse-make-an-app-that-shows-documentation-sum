from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from backend.app.db.session import get_db
from backend.app.models.document import Document
from backend.app.models.summary import Summary
from backend.app.schemas.response import DocumentResponse, DocumentDetailResponse, PaginatedResponse

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("/", response_model=PaginatedResponse)
async def list_documents(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    total_stmt = select(func.count()).select_from(Document)
    total_result = await db.execute(total_stmt)
    total = total_result.scalar_one()
    stmt = select(Document).order_by(Document.id).limit(limit).offset(offset)
    result = await db.execute(stmt)
    documents = result.scalars().all()
    return PaginatedResponse(total=total, limit=limit, offset=offset, items=documents)

@router.get("/{doc_id}", response_model=DocumentDetailResponse)
async def get_document(doc_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Document).where(Document.id == doc_id).options(
        # eager load summary to avoid N+1
        select(Document).options(
            # Use joinedload for summary
            # Note: SQLAlchemy 2.x uses selectinload by default for relationships
        )
    )
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    # Load summary explicitly
    summary = None
    if doc.summary:
        summary = doc.summary
    return DocumentDetailResponse(
        id=doc.id,
        repository_id=doc.repository_id,
        path=doc.path,
        sha=doc.sha,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
        content=doc.content,
        summary=summary,
    )
