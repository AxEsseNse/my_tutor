import aiofiles
import os
from datetime import datetime
from random import choice
from zoneinfo import ZoneInfo

from fastapi import UploadFile
from pydantic import ValidationError
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from my_tutor.exceptions import (
    ThemeNotFoundError,
    ThemeAlreadyExistError,
    ThemeCardNotFoundError,
    LessonNotFoundError,
    SaveImageError,
    DeleteImageError,
    StudentNotFoundError,
    ThemeProgressFoundError
)
from my_tutor.models import ThemeModel, StudyingModel, LessonModel, StudentModel
from my_tutor.schemes import (
    AddThemeRequest,
    AddThemeResponse,
    DeleteThemeRequest,
    DeleteThemeResponse,
    UpdateThemeRequest,
    UpdateThemeResponse,
    AddThemeTheoryCardRequest,
    AddThemePracticeCardRequest,
    AddThemeCardResponse,
    DeleteThemeCardRequest,
    DeleteThemeCardResponse,
    UpdateThemeTheoryCardRequest,
    UpdateThemePracticeCardRequest,
    UpdateThemeCardResponse,
    UpdateStudentAnswersRequest,
    UpdateStudentAnswersResponse,
    UpdateStudentProgressRequest,
    UpdateStudentProgressResponse,
    UploadImageResponse
)
from my_tutor.domain import Theme, ThemeInfo, Lesson, CardTheory, CardPractice, CardPracticeTip, ThemeOption



moscow_tz = ZoneInfo('Europe/Moscow')
RUS_EXAMS = {
    1: "ЕГЭ",
    2: "ОГЭ"
}
THEME_STATUSES = {
    1: "Запланировано",
    2: "Изучено",
    3: "В процессе"
}
VARIABLE_SYMBOLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                    'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                    'U', 'V', 'W', 'X', 'Y', 'Z',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


class ThemeRepository:
    _theme = Theme
    _theme_info = ThemeInfo
    _lesson = Lesson
    _material_theory = CardTheory
    _material_practice = CardPractice
    _material_practice_tip = CardPracticeTip
    _theme_option = ThemeOption
    _student_model = StudentModel
    _theme_model = ThemeModel
    _lesson_model = LessonModel
    _studying_model = StudyingModel
    _add_theme_response = AddThemeResponse
    _delete_theme_response = DeleteThemeResponse
    _update_theme_response = UpdateThemeResponse
    _update_theme_student_answers_response = UpdateStudentAnswersResponse
    _update_theme_student_progress_response = UpdateStudentProgressResponse
    _add_theme_card_response = AddThemeCardResponse
    _delete_theme_card_response = DeleteThemeCardResponse
    _update_theme_card_response = UpdateThemeCardResponse
    _upload_image_response = UploadImageResponse
    _date_pattern = "%Y-%m-%d"
    _date_pattern_response = "%d.%m.%Y"
    _default_tip_image_path = "/storage/themes/default_image/default_tip_image.jpg"
    _default_theory_image_path = "/storage/themes/default_image/default_theory_image.jpg"
    _default_practice_image_path = "/storage/themes/default_image/default_practice_image.jpg"

    async def _get_new_theme_card_id(self, session: AsyncSession) -> int:
        return (await session.execute(self._theme_model.theme_card_id_seq.next_value())).scalar()

    def _to_theme_info(self, theme_model: ThemeModel) -> ThemeInfo:

        return self._theme_info(
            theme_id=theme_model.theme_id,
            exam=RUS_EXAMS[theme_model.exam_id],
            exam_task_number=theme_model.exam_task_number,
            title=theme_model.title,
            descr=theme_model.descr
        )

    def _to_theme(self, theme_model: ThemeModel) -> Theme:

        return self._theme(
            theme_id=theme_model.theme_id,
            exam=RUS_EXAMS[theme_model.exam_id],
            exam_task_number=theme_model.exam_task_number,
            title=theme_model.title,
            descr=theme_model.descr,
            material=theme_model.material
        )

    def _to_theme_option(self, theme_model: ThemeModel) -> ThemeOption:

        return self._theme_option(
            id=theme_model.theme_id,
            exam=RUS_EXAMS[theme_model.exam_id],
            exam_task_number=theme_model.exam_task_number,
            title=theme_model.title
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

    def _to_update_theme_student_answers_response(self) -> UpdateStudentAnswersResponse:

        return self._update_theme_student_answers_response(
            message="Новые ответы студента успешно сохранены"
        )

    def _to_update_theme_student_progress_response(self, studying_model: StudyingModel | None = None) -> UpdateStudentProgressResponse:
        if studying_model:
            return self._update_theme_student_progress_response(
                status=THEME_STATUSES[studying_model.theme_status_id],
                date=datetime.strftime(studying_model.date.astimezone(moscow_tz), self._date_pattern_response),
                message="Статус изучения темы изменен"
            )
        return self._update_theme_student_progress_response(
                status="Не изучалось",
                date="",
                message="Прогресс изучения темы обнулен"
            )

    def _to_add_theme_card_response(self, theme_model: ThemeModel) -> AddThemeCardResponse:

        return self._add_theme_card_response(
            exam=RUS_EXAMS[theme_model.exam_id],
            title=theme_model.title,
            message="В тему успешно добавлена карточка"
        )

    def _to_delete_theme_card_response(self, theme_model: ThemeModel, card_position: int) -> DeleteThemeCardResponse:

        return self._delete_theme_card_response(
            message=f'В теме "{theme_model.title}" по профилю {RUS_EXAMS[theme_model.exam_id]} успешно удалена карточка № {card_position}'
        )

    def _to_update_theme_card_response(self, theme_model: ThemeModel, new_position: int) -> UpdateThemeCardResponse:

        return self._update_theme_card_response(
            message=f'В теме "{theme_model.title}" по профилю {RUS_EXAMS[theme_model.exam_id]} успешно изменена карточка № {new_position}'
        )

    def _to_upload_image_response(self, image_path) -> UploadImageResponse:

        return self._upload_image_response(
            image_path=image_path
        )

    async def get_themes(self, session: AsyncSession) -> list[ThemeInfo]:
        themes_models = (await session.execute(select(self._theme_model).order_by(self._theme_model.exam_id, self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()

        return [self._to_theme_info(theme_model=theme_model) for theme_model in themes_models]

    async def get_exam_themes(self, session: AsyncSession, exam_id: int) -> list[ThemeInfo]:
        themes_models = (await session.execute(select(self._theme_model).filter_by(exam_id=exam_id).order_by(self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()

        return [self._to_theme_info(theme_model=theme_model) for theme_model in themes_models]

    async def get_exam_themes_options(self, session: AsyncSession, exam_id: int) -> dict[int, ThemeOption]:
        themes_models = (await session.execute(select(self._theme_model).filter_by(exam_id=exam_id).order_by(self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()

        return {theme_model.theme_id: self._to_theme_option(theme_model=theme_model) for theme_model in themes_models}

    async def get_theme(self, session: AsyncSession, theme_id: int) -> Theme:
        theme_model = (await session.execute(select(self._theme_model).filter_by(theme_id=theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        return self._to_theme(theme_model=theme_model)

    async def get_themes_options(self, session: AsyncSession) -> list[ThemeOption]:
        themes_models = (await session.execute(select(self._theme_model).order_by(desc(self._theme_model.exam_id), self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()

        return [self._to_theme_option(theme_model=theme_model) for theme_model in themes_models]

    async def get_theme_student_progress(self, session: AsyncSession, theme_id: int, student_id: int) -> dict:
        studying_model = (await session.execute(select(self._studying_model).filter_by(theme_id=theme_id, student_id=student_id))).scalars().first()

        if not studying_model:
            raise ThemeNotFoundError

        return studying_model.progress_cards if studying_model else dict()

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

    async def update_theme_student_answers(self, session: AsyncSession, lesson_data: UpdateStudentAnswersRequest) -> UpdateStudentAnswersResponse:
        studying_model = (
            await session.execute(select(self._studying_model).filter_by(theme_id=lesson_data.theme_id, student_id=lesson_data.student_id))).scalars().first()

        if not studying_model:
            theme_model = (
                await session.execute(
                    select(self._theme_model).filter_by(theme_id=lesson_data.theme_id))).scalars().first()

            if not theme_model:
                raise ThemeNotFoundError

            lesson_model = (
                await session.execute(
                    select(self._lesson_model).filter_by(lesson_id=lesson_data.lesson_id))).scalars().first()

            if not lesson_model:
                raise LessonNotFoundError

            studying_model = self._studying_model(
                student_id=lesson_data.student_id,
                theme_id=lesson_data.theme_id,
                date=lesson_model.date,
                theme_status_id="IN PROGRESS",
                progress_cards=dict()
            )

        studying_model.progress_cards = lesson_data.student_answers
        session.add(studying_model)

        return self._to_update_theme_student_answers_response()

    async def update_theme_student_progress(self, session: AsyncSession, theme_data: UpdateStudentProgressRequest) -> UpdateStudentProgressResponse:
        if not theme_data.status:
            studying_model = (await session.execute(
                select(self._studying_model).filter_by(theme_id=theme_data.theme_id,
                                                       student_id=theme_data.student_id))).scalars().first()
            if studying_model:
                await session.delete(studying_model)

            return self._to_update_theme_student_progress_response()

        if theme_data.date:
            aware_datetime = datetime.strptime(theme_data.date, self._date_pattern).replace(tzinfo=moscow_tz)
        else:
            aware_datetime = datetime.now(moscow_tz)

        studying_model = (await session.execute(
            select(self._studying_model).filter_by(theme_id=theme_data.theme_id,
                                                   student_id=theme_data.student_id))).scalars().first()

        if not studying_model:
            theme_model = (
                await session.execute(
                    select(self._theme_model).filter_by(theme_id=theme_data.theme_id))).scalars().first()

            if not theme_model:
                raise ThemeNotFoundError

            student_model = (
                await session.execute(select(self._student_model).filter_by(student_id=theme_data.student_id))).scalars().first()

            if not student_model:
                raise StudentNotFoundError

            studying_model = self._studying_model(
                student_id=theme_data.student_id,
                theme_id=theme_data.theme_id,
                date=aware_datetime,
                theme_status_id=theme_data.status,
                progress_cards=dict()
            )
        else:
            studying_model.theme_status_id = theme_data.status
            studying_model.date = aware_datetime

        session.add(studying_model)

        return self._to_update_theme_student_progress_response(studying_model=studying_model)

    async def get_theme_cards(self, session: AsyncSession, theme_id: int) -> list[CardTheory | CardPractice]:
        theme_model = (await session.execute(select(self._theme_model).filter_by(theme_id=theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        print(theme_model.material)

        return theme_model.material
        #return {card["card_id"]: card for card in theme_model.material}

    @staticmethod
    def create_random_image_name():
        return "".join([choice(VARIABLE_SYMBOLS) for _ in range(5)]) + ".jpg"

    async def save_image_to_file(self, path: str, image_data: UploadFile) -> UploadImageResponse:
        exam_task_number_folder = "storage/themes/" + path

        try:
            if not os.path.exists(exam_task_number_folder):
                os.makedirs(exam_task_number_folder)

            image_path = exam_task_number_folder + self.create_random_image_name()

            async with aiofiles.open(image_path, 'wb') as file:
                while True:
                    image_part = image_data.file.read(1024)
                    if not image_part:
                        break
                    await file.write(image_part)
            return self._to_upload_image_response(image_path=f"/{image_path}")
        except Exception:
            raise SaveImageError

    async def delete_image_from_storage(self, image_path: str) -> bool:
        try:
            if os.path.exists(image_path[1:]):
                if image_path in (
                self._default_theory_image_path, self._default_practice_image_path, self._default_tip_image_path):
                    return False
                os.remove(image_path[1:])
            return False
        except Exception as e:
            return True

    async def add_theme_card(
            self,
            session: AsyncSession,
            theme_card_data: AddThemePracticeCardRequest | AddThemeTheoryCardRequest
    ) -> AddThemeCardResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_card_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        match theme_card_data:
            case AddThemeTheoryCardRequest():
                new_card = self._material_theory(
                    card_id=await self._get_new_theme_card_id(session=session),
                    type="theory",
                    title=theme_card_data.title,
                    descr=theme_card_data.descr,
                    image_path=theme_card_data.image_path or self._default_theory_image_path
                )
            case AddThemePracticeCardRequest():
                new_tip = self._material_practice_tip(
                    image_path=theme_card_data.tip_image_path or self._default_tip_image_path,
                    descr=theme_card_data.tip_descr if theme_card_data.tip_descr else ""
                )
                new_card = self._material_practice(
                    card_id=await self._get_new_theme_card_id(session=session),
                    type="practice",
                    title=theme_card_data.title,
                    descr=theme_card_data.descr,
                    image_path=theme_card_data.image_path or self._default_practice_image_path,
                    answer=theme_card_data.answer,
                    tip=new_tip
                )
            case _:
                raise ValidationError

        serialized_card = new_card.dict()

        if theme_card_data.card_position == 0:
            theme_model.material.append(serialized_card)
        else:
            theme_model.material.insert(theme_card_data.card_position - 1, serialized_card)

        flag_modified(theme_model, "material")
        session.add(theme_model)

        return self._to_add_theme_card_response(theme_model=theme_model)

    async def delete_theme_card(
            self,
            session: AsyncSession,
            theme_card_data: DeleteThemeCardRequest
    ) -> DeleteThemeCardResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_card_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        if theme_card_data.card_id != theme_model.material[theme_card_data.card_position - 1]["card_id"]:
            raise ThemeCardNotFoundError

        card = theme_model.material[theme_card_data.card_position - 1]

        image_path = card["image_path"]
        tip_image_path = card["tip"]["image_path"] if card["type"] == "practice" else None

        image_exists = await self.delete_image_from_storage(image_path)
        image_tip_exists = await self.delete_image_from_storage(tip_image_path) if tip_image_path else False

        if image_exists or image_tip_exists:
            raise DeleteImageError

        del theme_model.material[theme_card_data.card_position - 1]
        flag_modified(theme_model, "material")
        session.add(theme_model)

        return self._to_delete_theme_card_response(theme_model=theme_model, card_position=theme_card_data.card_position)

    async def update_theme_card(
            self,
            session: AsyncSession,
            theme_card_data: UpdateThemeTheoryCardRequest | UpdateThemePracticeCardRequest
    ) -> UpdateThemeCardResponse:
        theme_model = (
            await session.execute(select(self._theme_model).filter_by(theme_id=theme_card_data.theme_id))).scalars().first()

        if not theme_model:
            raise ThemeNotFoundError

        if theme_card_data.current_position > len(theme_model.material):
            raise ThemeCardNotFoundError

        current_image_path = theme_model.material[theme_card_data.current_position - 1]["image_path"]
        if current_image_path != theme_card_data.image_path:
            image_exists = await self.delete_image_from_storage(current_image_path)

            if image_exists:
                raise DeleteImageError

        match theme_card_data:
            case UpdateThemeTheoryCardRequest():
                updated_card = self._material_theory(
                    card_id=theme_card_data.card_id,
                    type="theory",
                    title=theme_card_data.title,
                    descr=theme_card_data.descr,
                    image_path=theme_card_data.image_path or self._default_theory_image_path
                )
            case UpdateThemePracticeCardRequest():
                current_tip_image_path = theme_model.material[theme_card_data.current_position - 1]["tip"]["image_path"]
                if current_tip_image_path != theme_card_data.tip_image_path:
                    image_tip_exists = await self.delete_image_from_storage(current_tip_image_path)

                    if image_tip_exists:
                        raise DeleteImageError

                new_tip = self._material_practice_tip(
                    image_path=theme_card_data.tip_image_path or self._default_tip_image_path,
                    descr=theme_card_data.tip_descr if theme_card_data.tip_descr else ""
                )
                updated_card = self._material_practice(
                    card_id=theme_card_data.card_id,
                    type="practice",
                    title=theme_card_data.title,
                    descr=theme_card_data.descr,
                    image_path=theme_card_data.image_path or self._default_practice_image_path,
                    answer=theme_card_data.answer,
                    tip=new_tip
                )
            case _:
                raise ValidationError

        serialized_card = updated_card.dict()
        del theme_model.material[theme_card_data.current_position - 1]
        theme_model.material.insert(theme_card_data.new_position - 1, serialized_card)
        flag_modified(theme_model, "material")
        session.add(theme_model)
        return self._to_update_theme_card_response(theme_model=theme_model, new_position=theme_card_data.new_position)
