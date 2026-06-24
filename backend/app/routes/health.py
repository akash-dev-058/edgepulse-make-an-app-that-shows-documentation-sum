from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.session import get_db
from sqlalchemy import select, text

router = APIRouter(tags=["health"])

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        return {"status": "unhealthy"}
    return {"status": "healthy"}
