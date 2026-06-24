from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import relationship
from .base import Base

class Document(Base):
    __tablename__ = "documents"
    __table_args__ = (
        Index("ix_documents_path", "path"),
        Index("ix_documents_sha", "sha"),
    )

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    path = Column(String(1024), nullable=False)
    sha = Column(String(40), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    repository = relationship("Repository", backref="documents")
    summary = relationship("Summary", uselist=False, back_populates="document", cascade="all, delete-orphan")
