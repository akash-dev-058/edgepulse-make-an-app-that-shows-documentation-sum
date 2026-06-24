from sqlalchemy import Column, Integer, String, DateTime, func, Index
from .base import Base

class Repository(Base):
    __tablename__ = "repositories"
    __table_args__ = (Index("ix_repositories_name", "name"),)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(String, nullable=True)
    stars = Column(Integer, nullable=False, default=0)
    forks = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
