from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError, ThemeAlreadyExistError
from my_tutor.models import ThemeModel
from my_tutor.schemes import (
    AddThemeRequest,
    AddThemeResponse,
    DeleteThemeRequest,
    DeleteThemeResponse
)
from my_tutor.domain import Theme
RUS_EXAMS = {
    1: "ЕГЭ",
    2: "ОГЭ"
}


class ThemeRepository:
    _theme = Theme
    _theme_model = ThemeModel
    _add_theme_response = AddThemeResponse
    _delete_theme_response = DeleteThemeResponse

    def _to_theme(self, theme_model: ThemeModel) -> Theme:

        return self._theme(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            descr=theme_model.descr
        )

    def _to_add_theme_response(self, theme_model: ThemeModel) -> AddThemeResponse:

        return self._add_theme_response(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            descr=theme_model.descr,
            message="Новая тема успешно создана"
        )

    def _to_delete_theme_response(self, theme_model: DeleteThemeRequest) -> DeleteThemeResponse:

        return self._delete_theme_response(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            message="Тема успешно удалена"
        )

    async def _get_new_theme_id(self, session: AsyncSession) -> int:
        return await session.scalar(self._theme_model.id_seq.next_value())

    async def get_themes(self, session: AsyncSession) -> list[Theme]:
        themes_models = (await session.execute(select(self._theme_model).order_by(self._theme_model.exam_id, self._theme_model.title))).scalars().all()

        return [self._to_theme(theme_model=theme_model) for theme_model in themes_models]

    async def add_theme(self, session: AsyncSession, theme_data: AddThemeRequest) -> AddThemeResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(title=theme_data.title))).scalars().first()

        if theme_model:
            raise ThemeAlreadyExistError

        new_theme = self._theme_model(
            theme_id=await self._get_new_theme_id(session),
            exam_id=theme_data.exam_id,
            title=theme_data.title,
            descr=theme_data.descr,
            material={}
        )
        session.add(new_theme)

        return self._to_add_theme_response(theme_model=new_theme)

    async def delete_theme(self, session: AsyncSession, theme_data: DeleteThemeRequest) -> DeleteThemeResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(title=theme_data.title))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        delete_theme_response = self._to_delete_theme_response(theme_model=theme_model)
        await session.delete(theme_model)

        return delete_theme_response
