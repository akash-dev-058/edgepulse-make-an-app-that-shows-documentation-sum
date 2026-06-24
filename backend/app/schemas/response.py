from datetime import datetime
from pydantic import BaseModel, Field

class RepositoryResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    stars: int
    forks: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        orm_mode = True

class DocumentResponse(BaseModel):
    id: int
    repository_id: int
    path: str
    sha: str
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        orm_mode = True

class SummaryResponse(BaseModel):
    id: int
    document_id: int
    content: str
    tokens_used: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        orm_mode = True

class DocumentDetailResponse(DocumentResponse):
    content: str
    summary: SummaryResponse | None = None

class PaginatedResponse(BaseModel):
    total: int = Field(..., description="Total number of items matching the query")
    limit: int = Field(..., description="Maximum number of items returned")
    offset: int = Field(..., description="Offset of the first item in this page")
    items: list
