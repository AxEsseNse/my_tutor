from datetime import datetime

from sqlalchemy import Integer, Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from my_tutor.models import Base


class TokenModel(Base):
    __tablename__ = 'user_tokens'

    token = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(Integer, ForeignKey(column='users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
