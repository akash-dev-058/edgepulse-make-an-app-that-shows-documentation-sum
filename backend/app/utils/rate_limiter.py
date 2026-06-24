import os
import time
import redis
from fastapi import HTTPException, status

class RateLimiter:
    """Simple token bucket rate limiter using Redis.

    The limit and period are configurable via environment variables.
    """

    def __init__(self) -> None:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.client = redis.from_url(redis_url)
        self.max_requests = int(os.getenv("RATE_LIMIT_MAX", "100"))
        self.period = int(os.getenv("RATE_LIMIT_PERIOD", "60"))  # seconds

    def is_allowed(self, identifier: str) -> bool:
        key = f"rl:{identifier}"
        current = self.client.get(key)
        if current is None:
            # First request – set with expiry
            self.client.set(key, 1, ex=self.period)
            return True
        count = int(current)
        if count < self.max_requests:
            self.client.incr(key)
            return True
        return False

    def enforce(self, identifier: str) -> None:
        if not self.is_allowed(identifier):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")
