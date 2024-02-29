import asyncio
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    create_async_engine,
)
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


DATABASE_URL = "postgresql+asyncpg://axessense:itarmenia@localhost:5432/my_tutor"
DATABASE_SYNC_URL = "postgresql://axessense:itarmenia@localhost:5432/my_tutor"

async_engine = create_async_engine(url=DATABASE_URL) #echo=True для логгирования взаимодействий с БД
session_factory = sessionmaker(bind=async_engine, class_=AsyncSession, autoflush=True, expire_on_commit=True)
AsyncScopedSession = async_scoped_session(session_factory, asyncio.current_task)
sync_engine = create_engine(DATABASE_SYNC_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncScopedSession() as session:
        yield session
