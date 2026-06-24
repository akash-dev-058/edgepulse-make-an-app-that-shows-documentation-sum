import logging
from celery import shared_task
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.session import AsyncSessionLocal
from backend.app.models.document import Document
from backend.app.models.summary import Summary
from backend.app.services.llm_client import LLMClient

logger = logging.getLogger(__name__)

@shared_task(name="generate_summary_task")
def generate_summary_task(document_id: int) -> None:
    """Celery task that generates a summary for a given document.
    """
    import asyncio
    asyncio.run(_process(document_id))

async def _process(document_id: int) -> None:
    async with AsyncSessionLocal() as session:
        doc = await session.get(Document, document_id)
        if not doc:
            logger.error("Document %s not found for summarization", document_id)
            return
        llm = LLMClient()
        try:
            summary_text = await llm.summarize(doc.content)
        except Exception as exc:
            logger.exception("Failed to generate summary for document %s", document_id)
            return
        # Upsert summary
        stmt = (
            await session.execute(
                select(Summary).where(Summary.document_id == document_id)
            )
        )
        existing = stmt.scalar_one_or_none()
        if existing:
            existing.content = summary_text
            existing.tokens_used = 0  # token count could be extracted from response if needed
        else:
            new_summary = Summary(document_id=document_id, content=summary_text, tokens_used=0)
            session.add(new_summary)
        await session.commit()
        logger.info("Summary generated for document %s", document_id)

@shared_task(name="periodic_sync")
def periodic_sync() -> None:
    """Periodic task that triggers a full sync of the wiki.
    """
    from backend.app.services.ingestion_service import IngestionService
    import asyncio
    async def _run():
        async with AsyncSessionLocal() as session:
            service = IngestionService(session)
            await service.sync()
            await service.close()
    asyncio.run(_run())
