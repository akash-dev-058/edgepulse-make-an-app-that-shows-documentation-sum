from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from backend.app.db.session import get_db
from backend.app.models.document import Document
from backend.app.models.summary import Summary
from backend.app.schemas.response import DocumentResponse, PaginatedResponse

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/", response_model=PaginatedResponse)
async def search_documents(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    # Use PostgreSQL full-text search on title (path) and summary content
    ts_query = func.plainto_tsquery('english', q)
    stmt = (
        select(Document, Summary)
        .join(Summary, Document.id == Summary.document_id, isouter=True)
        .where(
            func.to_tsvector('english', Document.path).op('@@')(ts_query) |
            func.to_tsvector('english', Summary.content).op('@@')(ts_query)
        )
        .order_by(func.ts_rank_cd(func.to_tsvector('english', Document.path) + func.coalesce(func.to_tsvector('english', Summary.content), ''), ts_query).desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    rows = result.all()
    items = []
    for doc, _ in rows:
        items.append(doc)
    # Total count (approximate) using count(*) with same where clause
    count_stmt = select(func.count()).select_from(Document).join(Summary, Document.id == Summary.document_id, isouter=True).where(
        func.to_tsvector('english', Document.path).op('@@')(ts_query) |
        func.to_tsvector('english', Summary.content).op('@@')(ts_query)
    )
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    return PaginatedResponse(total=total, limit=limit, offset=offset, items=items)
