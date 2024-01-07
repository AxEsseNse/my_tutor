import asyncio
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    create_async_engine,
)
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "postgresql://axessense:itarmenia@localhost:5432/my_tutor"


engine = create_async_engine(url=DATABASE_URL, echo=True)
session_factory = sessionmaker(bind=engine, class_=AsyncSession, autoflush=True, expire_on_commit=True)
AsyncScopedSession = async_scoped_session(session_factory, asyncio.current_task)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncScopedSession() as session:
        yield session
