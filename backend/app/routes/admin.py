from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.services.ingestion_service import IngestionService
from backend.app.db.session import get_db
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/sync", status_code=status.HTTP_202_ACCEPTED)
async def trigger_sync(user: dict = Depends(get_current_user), db = Depends(get_db)):
    # Simple admin check – in real world, verify role
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    service = IngestionService(db)
    await service.sync()
    await service.close()
    return {"detail": "Sync started"}
