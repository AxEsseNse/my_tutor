from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from my_tutor.exceptions import ThemeNotFoundError, ThemeAlreadyExistError, ThemeMaterialNotFoundError
from my_tutor.models import ThemeModel
from my_tutor.schemes import (
    AddThemeRequest,
    AddThemeResponse,
    DeleteThemeRequest,
    DeleteThemeResponse,
    UpdateThemeRequest,
    UpdateThemeResponse,
    AddThemeMaterialTheoryRequest,
    AddThemeMaterialPracticeRequest,
    AddThemeMaterialResponse,
    DeleteThemeMaterialRequest,
    DeleteThemeMaterialResponse,
    UpdateThemeMaterialTheoryRequest,
    UpdateThemeMaterialPracticeRequest,
    UpdateThemeMaterialResponse
)
from my_tutor.domain import Theme, Lesson, MaterialTheory, MaterialPractice, MaterialPracticeTip, ThemeOption
RUS_EXAMS = {
    1: "ЕГЭ",
    2: "ОГЭ"
}


class ThemeRepository:
    _theme = Theme
    _lesson = Lesson
    _material_theory = MaterialTheory
    _material_practice_tip = MaterialPracticeTip
    _material_practice = MaterialPractice
    _theme_option = ThemeOption
    _theme_model = ThemeModel
    _add_theme_response = AddThemeResponse
    _delete_theme_response = DeleteThemeResponse
    _update_theme_response = UpdateThemeResponse
    _add_theme_material_response = AddThemeMaterialResponse
    _delete_theme_material_response = DeleteThemeMaterialResponse
    _update_theme_material_response = UpdateThemeMaterialResponse

    def _to_theme(self, theme_model: ThemeModel) -> Theme:

        return self._theme(
            theme_id=theme_model.theme_id,
            exam=RUS_EXAMS[theme_model.exam_id],
            exam_task_number=theme_model.exam_task_number,
            title=theme_model.title,
            descr=theme_model.descr
        )

    def _to_lesson(self, theme_model: ThemeModel) -> Lesson:

        return self._lesson(
            exam=RUS_EXAMS[theme_model.exam_id],
            exam_task_number=theme_model.exam_task_number,
            title=theme_model.title,
            material=theme_model.material,
            message="Данные урока успешно получены"
        )

    def _to_theme_option(self, theme_model: ThemeModel) -> ThemeOption:

        return self._theme_option(
            id=theme_model.theme_id,
            name=f"{RUS_EXAMS[theme_model.exam_id]}-{theme_model.exam_task_number} {theme_model.title}"
        )

    def _to_add_theme_response(self, theme_model: ThemeModel) -> AddThemeResponse:

        return self._add_theme_response(
            theme_id=theme_model.theme_id,
            exam=RUS_EXAMS[theme_model.exam_id],
            exam_task_number=theme_model.exam_task_number,
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

    def _to_update_theme_response(self, theme_model: UpdateThemeRequest) -> UpdateThemeResponse:

        return self._update_theme_response(
            theme_id=theme_model.theme_id,
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            descr=theme_model.descr,
            message="Тема успешно изменена"
        )

    def _to_add_theme_material_response(self, theme_model: ThemeModel) -> AddThemeMaterialResponse:

        return self._add_theme_material_response(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            message="В тему успешно добавлена карточка"
        )

    def _to_delete_theme_material_response(self, theme_model: ThemeModel, card: int, type_card: str) -> DeleteThemeMaterialResponse:

        return self._delete_theme_material_response(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            card=card,
            type_card=type_card,
            message="В теме успешно удалена карточка"
        )

    def _to_update_theme_material_response(self, theme_model: ThemeModel) -> UpdateThemeMaterialResponse:

        return self._update_theme_material_response(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            message="В теме успешно изменена карточка"
        )

    # async def _get_new_practice_material_id(self, session: AsyncSession) -> int:
    #
    #     return await session.scalar(self._theme_model.practice_seq.next_value())

    async def get_themes(self, session: AsyncSession) -> list[Theme]:
        themes_models = (await session.execute(select(self._theme_model).order_by(self._theme_model.exam_id, self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()

        return [self._to_theme(theme_model=theme_model) for theme_model in themes_models]

    async def get_theme(self, session: AsyncSession, theme_id: int) -> Lesson:
        theme_model = (await session.execute(select(self._theme_model).filter_by(theme_id=theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        print(theme_model)
        return self._to_lesson(theme_model=theme_model)

    async def get_themes_options(self, session: AsyncSession) -> list[ThemeOption]:
        themes_models = (await session.execute(select(self._theme_model).order_by(desc(self._theme_model.exam_id), self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()

        return [self._to_theme_option(theme_model=theme_model) for theme_model in themes_models]

    async def add_theme(self, session: AsyncSession, theme_data: AddThemeRequest) -> AddThemeResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(title=theme_data.title, exam_id=theme_data.exam_id, descr=theme_data.descr))).scalars().first()

        if theme_model:
            raise ThemeAlreadyExistError

        new_theme = self._theme_model(
            exam_id=theme_data.exam_id,
            exam_task_number=theme_data.exam_task_number,
            title=theme_data.title,
            descr=theme_data.descr,
            material=[]
        )
        session.add(new_theme)
        await session.flush()

        return self._to_add_theme_response(theme_model=new_theme)

    async def delete_theme(self, session: AsyncSession, theme_data: DeleteThemeRequest) -> DeleteThemeResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        delete_theme_response = self._to_delete_theme_response(theme_model=theme_model)
        await session.delete(theme_model)

        return delete_theme_response

    async def update_theme(self, session: AsyncSession, theme_data: UpdateThemeRequest) -> UpdateThemeResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        theme_model.exam_id = theme_data.exam_id
        theme_model.title = theme_data.title
        theme_model.descr = theme_data.descr
        session.add(theme_model)

        return self._to_update_theme_response(theme_model=theme_model)

    async def add_theme_material(
            self,
            session: AsyncSession,
            theme_material_data: AddThemeMaterialTheoryRequest | AddThemeMaterialPracticeRequest
    ) -> AddThemeMaterialResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_material_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        if theme_material_data.type == "theory":
            new_card = self._material_theory(
                type="theory",
                title=theme_material_data.title,
                image_path=theme_material_data.image_path,
                descr=theme_material_data.descr
            )
        else:
            # practice_id = await self._get_new_practice_material_id(session=session)
            if theme_material_data.tip:
                new_tip = self._material_practice_tip(
                    image_path=theme_material_data.tip_image_path,
                    descr=theme_material_data.tip_descr
                )
            else:
                new_tip = None
            new_card = self._material_practice(
                # id=practice_id,
                type="practice",
                title=theme_material_data.title,
                image_path=theme_material_data.image_path,
                descr=theme_material_data.descr,
                answer=theme_material_data.answer,
                tip=new_tip
            )
        serialized_card = new_card.dict()
        theme_material = theme_model.material
        theme_material.insert(theme_material_data.position, serialized_card)
        theme_model.material = theme_material
        flag_modified(theme_model, "material")
        session.add(theme_model)

        return self._to_add_theme_material_response(theme_model=theme_model)

    async def delete_theme_material(
            self,
            session: AsyncSession,
            theme_material_data: DeleteThemeMaterialRequest
    ) -> DeleteThemeMaterialResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_material_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        if theme_material_data.card > len(theme_model.material):
            raise ThemeMaterialNotFoundError

        type_card = theme_model.material[theme_material_data.card-1]["type"]

        del theme_model.material[theme_material_data.card-1]
        flag_modified(theme_model, "material")
        session.add(theme_model)

        return self._to_delete_theme_material_response(theme_model=theme_model, card=theme_material_data.card, type_card=type_card)

    async def update_theme_material(
            self,
            session: AsyncSession,
            theme_material_data: UpdateThemeMaterialTheoryRequest | UpdateThemeMaterialPracticeRequest
    ) -> UpdateThemeMaterialResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_material_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        if theme_material_data.position > len(theme_model.material):
            raise ThemeMaterialNotFoundError

        if theme_material_data.type == "theory":
            new_card = self._material_theory(
                type="theory",
                title=theme_material_data.title,
                image_path=theme_material_data.image_path,
                descr=theme_material_data.descr
            )
        else:
            # practice_id = await self._get_new_practice_material_id(session=session)

            if theme_material_data.tip:
                new_tip = self._material_practice_tip(
                    image_path=theme_material_data.tip_image_path,
                    descr=theme_material_data.tip_descr
                )
            else:
                new_tip = None
            new_card = self._material_practice(
                # id=practice_id,
                type="practice",
                title=theme_material_data.title,
                image_path=theme_material_data.image_path,
                descr=theme_material_data.descr,
                answer=theme_material_data.answer,
                tip=new_tip
            )

        serialized_card = new_card.dict()
        theme_model.material[theme_material_data.position-1] = serialized_card
        flag_modified(theme_model, "material")
        session.add(theme_model)

        return self._to_update_theme_material_response(theme_model=theme_model)
