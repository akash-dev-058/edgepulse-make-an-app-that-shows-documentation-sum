from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from backend.app.utils.rate_limiter import RateLimiter

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.limiter = RateLimiter()

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        try:
            self.limiter.enforce(client_ip)
        except HTTPException as exc:
            return exc
        response = await call_next(request)
        return response
