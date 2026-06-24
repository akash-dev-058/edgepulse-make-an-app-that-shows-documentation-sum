import os
import httpx
from typing import List, Dict
from urllib.parse import urljoin
from fastapi import HTTPException

class DeepWikiClient:
    """Client for interacting with the DeepWiki MCP API.

    The client expects two environment variables:
    - DEEPWIKI_API_URL: Base URL of the DeepWiki service
    - DEEPWIKI_API_TOKEN: Bearer token for authentication
    """

    def __init__(self) -> None:
        self.base_url = os.getenv("DEEPWIKI_API_URL")
        token = os.getenv("DEEPWIKI_API_TOKEN")
        if not self.base_url or not token:
            raise RuntimeError("DeepWiki configuration missing in environment")
        self.headers = {"Authorization": f"Bearer {token}"}
        self.client = httpx.AsyncClient(base_url=self.base_url, headers=self.headers, timeout=30.0)

    async def read_wiki_structure(self, repo: str) -> List[Dict[str, str]]:
        """Retrieve the list of wiki pages for a repository.

        Returns a list of dicts with at least a ``title`` key.
        """
        endpoint = f"/repos/{repo}/wiki/structure"
        try:
            response = await self.client.get(endpoint)
            response.raise_for_status()
            data = response.json()
            return data.get("pages", [])
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail="Failed to fetch wiki structure")
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))

    async def read_wiki_contents(self, repo: str, title: str) -> str:
        """Fetch the raw markdown content of a specific wiki page.
        """
        endpoint = f"/repos/{repo}/wiki/content"
        params = {"title": title}
        try:
            response = await self.client.get(endpoint, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("content", "")
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail="Failed to fetch wiki content")
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))

    async def close(self) -> None:
        await self.client.aclose()
