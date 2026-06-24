import os
import logging
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete
from backend.app.models.repository import Repository
from backend.app.models.document import Document
from backend.app.models.summary import Summary
from backend.app.utils.deepwiki_client import DeepWikiClient
from backend.app.tasks.summarize import generate_summary_task

logger = logging.getLogger(__name__)

class IngestionService:
    """Service responsible for syncing the React wiki into the database.

    It uses the DeepWikiClient to fetch page titles and markdown content, stores
    them as ``Document`` records, and enqueues a Celery task to generate a summary.
    """

    REPO_NAME = "facebook/react"

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.deepwiki = DeepWikiClient()

    async def _ensure_repository(self) -> Repository:
        stmt = select(Repository).where(Repository.name == self.REPO_NAME)
        result = await self.db.execute(stmt)
        repo = result.scalar_one_or_none()
        if repo:
            return repo
        repo = Repository(name=self.REPO_NAME, description="Facebook React repository wiki", stars=0, forks=0)
        self.db.add(repo)
        await self.db.commit()
        await self.db.refresh(repo)
        return repo

    async def sync(self) -> None:
        """Main entry point to synchronize all wiki pages.
        """
        repo = await self._ensure_repository()
        logger.info("Starting ingestion for repository %s", self.REPO_NAME)
        pages = await self.deepwiki.read_wiki_structure(self.REPO_NAME)
        for page in pages:
            title = page.get("title")
            if not title:
                continue
            await self._process_page(repo.id, title)
        logger.info("Ingestion completed for repository %s", self.REPO_NAME)

    async def _process_page(self, repository_id: int, title: str) -> None:
        """Fetch a single page, store or update the Document, and queue summarization.
        """
        content = await self.deepwiki.read_wiki_contents(self.REPO_NAME, title)
        sha = self._compute_sha(content)
        stmt = select(Document).where(Document.repository_id == repository_id, Document.path == title)
        result = await self.db.execute(stmt)
        doc = result.scalar_one_or_none()
        if doc:
            if doc.sha == sha:
                logger.debug("Document %s unchanged, skipping", title)
                return
            # Update existing document
            await self.db.execute(
                update(Document)
                .where(Document.id == doc.id)
                .values(content=content, sha=sha)
            )
            await self.db.commit()
            logger.info("Updated document %s", title)
        else:
            # Insert new document
            new_doc = Document(repository_id=repository_id, path=title, sha=sha, content=content)
            self.db.add(new_doc)
            await self.db.commit()
            await self.db.refresh(new_doc)
            doc = new_doc
            logger.info("Inserted new document %s", title)
        # Enqueue summarization task (fire-and-forget)
        generate_summary_task.delay(doc.id)

    @staticmethod
    def _compute_sha(content: str) -> str:
        """Compute a simple SHA-1 hash of the content for change detection.
        """
        import hashlib
        return hashlib.sha1(content.encode("utf-8")).hexdigest()

    async def close(self) -> None:
        await self.deepwiki.close()
