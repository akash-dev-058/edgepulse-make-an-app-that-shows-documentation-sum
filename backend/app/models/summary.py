from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import relationship
from .base import Base

class Summary(Base):
    __tablename__ = "summaries"
    __table_args__ = (Index("ix_summaries_document_id", "document_id"),)

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True)
    content = Column(Text, nullable=False)
    tokens_used = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    document = relationship("Document", back_populates="summary")
