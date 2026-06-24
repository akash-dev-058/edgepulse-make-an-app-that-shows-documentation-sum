import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes.documents import router as documents_router
from backend.app.routes.search import router as search_router
from backend.app.routes.admin import router as admin_router
from backend.app.routes.health import router as health_router
from backend.app.middleware.request_id import RequestIDMiddleware
from backend.app.middleware.error_handler import http_exception_handler, generic_exception_handler
from backend.app.middleware.auth import create_access_token

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ReactDocsPulse Backend", version="0.1.0")

# CORS configuration – allow frontend origin
frontend_url = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request ID middleware
app.add_middleware(RequestIDMiddleware)

# Register routers
app.include_router(documents_router)
app.include_router(search_router)
app.include_router(admin_router)
app.include_router(health_router)

# Exception handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup – initializing resources")
    # Example: could preload cache, etc.

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown – cleaning up resources")
    # Close any connections if needed

# Simple endpoint to obtain a JWT for admin (for demo purposes only)
@app.post("/token", summary="Generate a demo admin JWT token")
async def login():
    # In production, validate credentials!
    token = create_access_token({"sub": "admin_user", "role": "admin"})
    return {"access_token": token, "token_type": "bearer"}
