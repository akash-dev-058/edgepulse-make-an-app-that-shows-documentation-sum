import os
from celery import Celery
from celery.schedules import crontab

BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
RESULT_BACKEND = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery = Celery("reactdocs", broker=BROKER_URL, backend=RESULT_BACKEND)

celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    beat_schedule={
        "periodic-sync": {
            "task": "backend.app.tasks.summarize.periodic_sync",
            "schedule": crontab(minute="0", hour="*/6"),  # every 6 hours
        }
    },
)
