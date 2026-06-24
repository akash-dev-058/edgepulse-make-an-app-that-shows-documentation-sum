import os
import logging
from typing import List
import openai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class LLMClient:
    """Wrapper around OpenAI's async client for generating summaries.
    """

    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY not set in environment")
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = "gpt-4o-mini"
        self.max_tokens = 500

    async def summarize(self, content: str) -> str:
        """Generate a concise summary of the provided markdown content.
        """
        prompt = (
            "You are an expert summarizer for React documentation. Produce a concise bullet-point summary "
            "that captures the main concepts, usage examples, and any important warnings. Keep the summary under 150 words."
        )
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": prompt}, {"role": "user", "content": content}],
                temperature=0.2,
                max_tokens=self.max_tokens,
                top_p=1,
                n=1,
            )
            summary = response.choices[0].message.content.strip()
            return summary
        except Exception as exc:
            logger.exception("LLM summarization failed")
            raise
