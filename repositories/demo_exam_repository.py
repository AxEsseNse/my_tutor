import aiofiles
import hashlib
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
    DemoExamNotFoundError,
    DemoExamAlreadyExistError,
    DemoExamTaskAlreadyExistError,
    DemoExamTaskNotFoundError,
    DeleteFileError
    # ThemeNotFoundError,
    # ThemeAlreadyExistError,
    # ThemeCardNotFoundError,
    # LessonNotFoundError,
    # SaveFileError,
    # StudentNotFoundError,
    # ThemeProgressFoundError
)
from my_tutor.models import DemoExamModel
from my_tutor.schemes import (
    AddDemoExamRequest,
    AddDemoExamResponse,
    DeleteDemoExamResponse,
    UpdateDemoExamRequest,
    UpdateDemoExamResponse,
    AddDemoExamTaskRequest,
    AddDemoExamTaskResponse,
    DeleteDemoExamTaskResponse,
    UpdateDemoExamTaskRequest,
    UpdateDemoExamTaskResponse
    # AddThemeRequest,
    # AddThemeResponse,
    # DeleteThemeRequest,
    # DeleteThemeResponse,
    # UpdateThemeRequest,
    # UpdateThemeResponse,
    # AddThemeTheoryCardRequest,
    # AddThemePracticeCardRequest,
    # AddThemeCardResponse,
    # DeleteThemeCardRequest,
    # DeleteThemeCardResponse,
    # UpdateThemeTheoryCardRequest,
    # UpdateThemePracticeCardRequest,
    # UpdateThemeCardResponse,
    # UpdateStudentAnswersRequest,
    # UpdateStudentAnswersResponse,
    # UpdateStudentProgressRequest,
    # UpdateStudentProgressResponse,
    # UploadFileResponse
)
from my_tutor.domain import DemoExamTask


moscow_tz = ZoneInfo('Europe/Moscow')
RUS_EXAMS = {
    1: "ЕГЭ",
    2: "ОГЭ"
}
# THEME_STATUSES = {
#     1: "Запланировано",
#     2: "Изучено",
#     3: "В процессе"
# }
# VARIABLE_SYMBOLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
#                     'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
#                     'u', 'v', 'w', 'x', 'y', 'z',
#                     'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
#                     'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
#                     'U', 'V', 'W', 'X', 'Y', 'Z',
#                     '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
CURRENT_DIRECTORY = os.getcwd()


class DemoExamRepository:
    # _theme = Theme
    # _theme_info = ThemeInfo
    # _lesson = Lesson
    _demo_exam_task = DemoExamTask
    # _theme_option = ThemeOption
    # _student_model = StudentModel
    _demo_exam_model = DemoExamModel
    # _lesson_model = LessonModel
    # _studying_model = StudyingModel
    _add_demo_exam_response = AddDemoExamResponse
    _delete_demo_exam_response = DeleteDemoExamResponse
    _update_demo_exam_response = UpdateDemoExamResponse
    # _update_theme_student_answers_response = UpdateStudentAnswersResponse
    # _update_theme_student_progress_response = UpdateStudentProgressResponse
    _add_demo_exam_task_response = AddDemoExamTaskResponse
    _delete_demo_exam_task_response = DeleteDemoExamTaskResponse
    _update_demo_exam_task_response = UpdateDemoExamTaskResponse
    # _upload_file_response = UploadFileResponse
    # _date_pattern = "%Y-%m-%d"
    # _date_pattern_response = "%d.%m.%Y"
    # _default_image_directory = ["storage", "themes", "default_image"]
    # _default_theory_image_directory = ["storage", "themes", "default_image", "theory"]
    _default_demo_exam_image_directory = ["storage", "demo_exams", "default_image"]
    # _default_tip_image_directory = ["storage", "themes", "default_image", "tip"]

    async def _get_new_demo_exam_task_id(self, session: AsyncSession) -> int:
        return (await session.execute(self._demo_exam_model.demo_exam_task_id_seq.next_value())).scalar()

    # def _to_theme_info(self, theme_model: ThemeModel) -> ThemeInfo:
    #
    #     return self._theme_info(
    #         theme_id=theme_model.theme_id,
    #         exam=RUS_EXAMS[theme_model.exam_id],
    #         exam_task_number=theme_model.exam_task_number,
    #         title=theme_model.title,
    #         descr=theme_model.descr
    #     )

    def _to_add_demo_exam_response(self, demo_exam_model: DemoExamModel) -> AddDemoExamResponse:

        return self._add_demo_exam_response(
            demo_exam_id=demo_exam_model.demo_exam_id,
            exam=RUS_EXAMS[demo_exam_model.exam_id],
            title=demo_exam_model.title,
            descr=demo_exam_model.descr,
            message="Новый шаблон для демоверсии успешно создан"
        )

    def _to_delete_demo_exam_response(self, demo_exam_model: DemoExamModel) -> DeleteDemoExamResponse:

        return self._delete_demo_exam_response(
            exam=RUS_EXAMS[demo_exam_model.exam_id],
            title=demo_exam_model.title,
            descr=demo_exam_model.descr,
            message="Демоверсия успешно удалена"
        )

    def _to_update_demo_exam_response(self, demo_exam_model: DemoExamModel) -> UpdateDemoExamResponse:

        return self._update_demo_exam_response(
            demo_exam_id=demo_exam_model.demo_exam_id,
            exam=RUS_EXAMS[demo_exam_model.exam_id],
            title=demo_exam_model.title,
            descr=demo_exam_model.descr,
            message="Демоверсия успешно изменена"
        )

    # def _to_update_demo_exam_student_progress_response(self, studying_model: StudyingModel | None = None) -> UpdateStudentProgressResponse:
    #     if studying_model:
    #         return self._update_theme_student_progress_response(
    #             status=THEME_STATUSES[studying_model.theme_status_id],
    #             date=datetime.strftime(studying_model.date.astimezone(moscow_tz), self._date_pattern_response),
    #             message="Статус изучения темы изменен"
    #         )
    #     return self._update_theme_student_progress_response(
    #             status="Не изучалось",
    #             date="",
    #             message="Прогресс изучения темы обнулен"
    #         )

    def _to_add_demo_exam_task_response(self, new_task: DemoExamTask, demo_exam_model: DemoExamModel, task_number: str) -> AddDemoExamTaskResponse:

        return self._add_demo_exam_task_response(
            image_path=new_task.image_path,
            file_path=new_task.file_path if hasattr(new_task, 'file_path') else None,
            message=f'В демоверсию "{demo_exam_model.title}" по профилю {RUS_EXAMS[demo_exam_model.exam_id]} успешно добавлено задание № {task_number}'
        )

    def _to_delete_demo_exam_task_response(self, task_number: str) -> DeleteDemoExamTaskResponse:

        return self._delete_demo_exam_task_response(
            message=f'Задание № {task_number} успешно удалено'
        )

    def _to_update_demo_exam_task_response(self, updated_task: DemoExamTask, demo_exam_model: DemoExamModel, task_number: str) -> UpdateDemoExamTaskResponse:

        return self._update_demo_exam_task_response(
            image_path=updated_task.image_path,
            file_path=updated_task.file_path if hasattr(updated_task, 'file_path') else None,
            message=f'В демоверсии "{demo_exam_model.title}" по профилю {RUS_EXAMS[demo_exam_model.exam_id]} успешно изменено задание № {task_number}'
        )
    #
    # def _to_upload_file_response(self, file_path) -> UploadFileResponse:
    #
    #     return self._upload_file_response(
    #         file_path=file_path
    #     )

    # async def get_themes(self, session: AsyncSession) -> list[ThemeInfo]:
    #     themes_models = (await session.execute(select(self._theme_model).order_by(self._theme_model.exam_id, self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()
    #
    #     return [self._to_theme_info(theme_model=theme_model) for theme_model in themes_models]
    #
    # async def get_exam_themes(self, session: AsyncSession, exam_id: int) -> list[ThemeInfo]:
    #     themes_models = (await session.execute(select(self._theme_model).filter_by(exam_id=exam_id).order_by(self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()
    #
    #     return [self._to_theme_info(theme_model=theme_model) for theme_model in themes_models]
    #
    # async def get_exam_themes_options(self, session: AsyncSession, exam_id: int) -> list[ThemeOption]:
    #     themes_models = (await session.execute(select(self._theme_model).filter_by(exam_id=exam_id).order_by(self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()
    #
    #     return [self._to_theme_option(theme_model=theme_model) for theme_model in themes_models]
    #
    # async def get_theme(self, session: AsyncSession, theme_id: int) -> Theme:
    #     theme_model = (await session.execute(select(self._theme_model).filter_by(theme_id=theme_id))).scalars().first()
    #
    #     if not theme_model:
    #         raise ThemeNotFoundError
    #
    #     return self._to_theme(theme_model=theme_model)
    #
    # async def get_themes_options(self, session: AsyncSession) -> list[ThemeOption]:
    #     themes_models = (await session.execute(select(self._theme_model).order_by(desc(self._theme_model.exam_id), self._theme_model.exam_task_number, self._theme_model.title))).scalars().all()
    #
    #     return [self._to_theme_option(theme_model=theme_model) for theme_model in themes_models]
    #
    # async def get_theme_student_progress(self, session: AsyncSession, theme_id: int, student_id: int) -> dict:
    #     studying_model = (await session.execute(select(self._studying_model).filter_by(theme_id=theme_id, student_id=student_id))).scalars().first()
    #
    #     if not studying_model:
    #         raise ThemeNotFoundError
    #
    #     return studying_model.progress_cards if studying_model else dict()

    async def add_demo_exam(self, session: AsyncSession, demo_exam_data: AddDemoExamRequest) -> AddDemoExamResponse:
        demo_exam_model = (
            await session.execute(select(self._demo_exam_model).filter_by(title=demo_exam_data.title, exam_id=demo_exam_data.exam_id, descr=demo_exam_data.descr))).scalars().first()

        if demo_exam_model:
            raise DemoExamAlreadyExistError

        new_demo_exam = self._demo_exam_model(
            exam_id=demo_exam_data.exam_id,
            title=demo_exam_data.title,
            descr=demo_exam_data.descr,
            material={},
            answers={}
        )
        session.add(new_demo_exam)
        await session.flush()

        return self._to_add_demo_exam_response(demo_exam_model=new_demo_exam)

    async def delete_demo_exam(self, session: AsyncSession, demo_exam_id: int) -> DeleteDemoExamResponse:
        demo_exam_model = (
            await session.execute(select(self._demo_exam_model).filter_by(demo_exam_id=demo_exam_id))).scalars().first()

        if not demo_exam_model:
            raise DemoExamNotFoundError

        delete_demo_exam_response = self._to_delete_demo_exam_response(demo_exam_model=demo_exam_model)
        await session.delete(demo_exam_model)

        return delete_demo_exam_response

    async def update_demo_exam(self, session: AsyncSession, demo_exam_data: UpdateDemoExamRequest) -> UpdateDemoExamResponse:
        demo_exam_model = (
            await session.execute(select(self._demo_exam_model).filter_by(demo_exam_id=demo_exam_data.demo_exam_id))).scalars().first()

        if not demo_exam_model:
            raise DemoExamNotFoundError

        demo_exam_model.exam_id = demo_exam_data.exam_id
        demo_exam_model.title = demo_exam_data.title
        demo_exam_model.descr = demo_exam_data.descr
        session.add(demo_exam_model)

        return self._to_update_demo_exam_response(demo_exam_model=demo_exam_model)

    # async def update_theme_student_answers(self, session: AsyncSession, lesson_data: UpdateStudentAnswersRequest) -> UpdateStudentAnswersResponse:
    #     studying_model = (
    #         await session.execute(select(self._studying_model).filter_by(theme_id=lesson_data.theme_id, student_id=lesson_data.student_id))).scalars().first()
    #
    #     if not studying_model:
    #         theme_model = (
    #             await session.execute(
    #                 select(self._theme_model).filter_by(theme_id=lesson_data.theme_id))).scalars().first()
    #
    #         if not theme_model:
    #             raise ThemeNotFoundError
    #
    #         lesson_model = (
    #             await session.execute(
    #                 select(self._lesson_model).filter_by(lesson_id=lesson_data.lesson_id))).scalars().first()
    #
    #         if not lesson_model:
    #             raise LessonNotFoundError
    #
    #         studying_model = self._studying_model(
    #             student_id=lesson_data.student_id,
    #             theme_id=lesson_data.theme_id,
    #             date=lesson_model.date,
    #             theme_status_id="IN PROGRESS",
    #             progress_cards=dict()
    #         )
    #
    #     studying_model.progress_cards = lesson_data.student_answers
    #     session.add(studying_model)
    #
    #     return self._to_update_theme_student_answers_response()
    #
    # async def update_theme_student_progress(self, session: AsyncSession, theme_data: UpdateStudentProgressRequest) -> UpdateStudentProgressResponse:
    #     if not theme_data.status:
    #         studying_model = (await session.execute(
    #             select(self._studying_model).filter_by(theme_id=theme_data.theme_id,
    #                                                    student_id=theme_data.student_id))).scalars().first()
    #         if studying_model:
    #             await session.delete(studying_model)
    #
    #         return self._to_update_theme_student_progress_response()
    #
    #     if theme_data.date:
    #         aware_datetime = datetime.strptime(theme_data.date, self._date_pattern).replace(tzinfo=moscow_tz)
    #     else:
    #         aware_datetime = datetime.now(moscow_tz)
    #
    #     studying_model = (await session.execute(
    #         select(self._studying_model).filter_by(theme_id=theme_data.theme_id,
    #                                                student_id=theme_data.student_id))).scalars().first()
    #
    #     if not studying_model:
    #         theme_model = (
    #             await session.execute(
    #                 select(self._theme_model).filter_by(theme_id=theme_data.theme_id))).scalars().first()
    #
    #         if not theme_model:
    #             raise ThemeNotFoundError
    #
    #         student_model = (
    #             await session.execute(select(self._student_model).filter_by(student_id=theme_data.student_id))).scalars().first()
    #
    #         if not student_model:
    #             raise StudentNotFoundError
    #
    #         studying_model = self._studying_model(
    #             student_id=theme_data.student_id,
    #             theme_id=theme_data.theme_id,
    #             date=aware_datetime,
    #             theme_status_id=theme_data.status,
    #             progress_cards=dict()
    #         )
    #     else:
    #         studying_model.theme_status_id = theme_data.status
    #         studying_model.date = aware_datetime
    #
    #     session.add(studying_model)
    #
    #     return self._to_update_theme_student_progress_response(studying_model=studying_model)
    #
    # async def get_theme_cards(self, session: AsyncSession, theme_id: int) -> list[CardTheory | CardPractice]:
    #     theme_model = (await session.execute(select(self._theme_model).filter_by(theme_id=theme_id))).scalars().first()
    #
    #     if not theme_model:
    #         raise ThemeNotFoundError
    #
    #     return theme_model.material

    @staticmethod
    def _get_random_default_image_path(directory):
        """
        Возвращает случайный путь к файлу изображения из указанной директории.
        """
        try:
            directory = os.path.join(*directory)
            files = [file for file in os.listdir(directory) if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg'))]
            if not files:
                raise ValueError("В директории нет изображений")
            random_file = choice(files)
            return f"{os.sep}{os.path.join(directory, random_file)}"
        except ValueError:
            return f"{os.sep}{os.path.join(directory, 'default_image.svg')}"

    async def add_demo_exam_task(
            self,
            session: AsyncSession,
            demo_exam_task_data: AddDemoExamTaskRequest
    ) -> AddDemoExamTaskResponse:
        demo_exam_model = (
            await session.execute(
                select(self._demo_exam_model).filter_by(demo_exam_id=demo_exam_task_data.demo_exam_id))).scalars().first()

        if not demo_exam_model:
            raise DemoExamNotFoundError

        if demo_exam_task_data.task_number in demo_exam_model.material:
            raise DemoExamTaskAlreadyExistError(demo_exam_task_data.task_number)

        new_demo_exam_task = self._demo_exam_task(
            demo_exam_task_id=await self._get_new_demo_exam_task_id(session=session),
            descr=demo_exam_task_data.descr,
            image_path=demo_exam_task_data.image_path or self._get_random_default_image_path(self._default_demo_exam_image_directory),
            file_path=demo_exam_task_data.file_path,
            file_name=f"{demo_exam_task_data.file_name}.{demo_exam_task_data.file_path.split('.')[-1]}" if demo_exam_task_data.file_path else demo_exam_task_data.file_name
        )

        serialized_task = new_demo_exam_task.dict()

        demo_exam_model.material[demo_exam_task_data.task_number] = serialized_task
        demo_exam_model.answers[demo_exam_task_data.task_number] = demo_exam_task_data.answer

        flag_modified(demo_exam_model, "material")
        flag_modified(demo_exam_model, "answers")
        session.add(demo_exam_model)

        return self._to_add_demo_exam_task_response(new_task=new_demo_exam_task, demo_exam_model=demo_exam_model, task_number=demo_exam_task_data.task_number)

    async def delete_demo_exam_task(
            self,
            session: AsyncSession,
            demo_exam_id: int,
            task_number: str,
            file_repository
    ) -> DeleteDemoExamTaskResponse:
        demo_exam_model = (
            await session.execute(
                select(self._demo_exam_model).filter_by(
                    demo_exam_id=demo_exam_id))).scalars().first()

        if not demo_exam_model:
            raise DemoExamNotFoundError

        if task_number not in demo_exam_model.material:
            raise DemoExamTaskNotFoundError(task_number)

        task = demo_exam_model.material[task_number]

        image_path = task["image_path"]
        file_path = task["file_path"] if "file_path" in task else None

        image_exists = await file_repository.delete_file_from_storage(session=session, file_path=image_path)
        file_exists = await file_repository.delete_file_from_storage(session=session, file_path=file_path) if file_path else False

        if image_exists or file_exists:
            raise DeleteFileError

        del demo_exam_model.material[task_number]
        del demo_exam_model.answers[task_number]
        flag_modified(demo_exam_model, "material")
        flag_modified(demo_exam_model, "answers")
        session.add(demo_exam_model)

        return self._to_delete_demo_exam_task_response(task_number=task_number)

    async def update_demo_exam_task(
            self,
            session: AsyncSession,
            demo_exam_task_data: UpdateDemoExamTaskRequest,
            file_repository
    ) -> UpdateDemoExamTaskResponse:
        demo_exam_model = (
            await session.execute(
                select(self._demo_exam_model).filter_by(
                    demo_exam_id=demo_exam_task_data.demo_exam_id))).scalars().first()

        if not demo_exam_model:
            raise DemoExamNotFoundError

        if demo_exam_task_data.task_number not in demo_exam_model.material:
            raise DemoExamTaskNotFoundError(demo_exam_task_data.task_number)

        task = demo_exam_model.material[demo_exam_model.task_number]

        current_image_path = task["image_path"]
        if current_image_path != demo_exam_task_data.image_path:
            image_exists = await file_repository.delete_file_from_storage(session=session, file_path=current_image_path)

            if image_exists:
                raise DeleteFileError
        else:
            if demo_exam_task_data.new_image_uploaded:
                await file_repository.update_file_reference_count(session=session, file_path=current_image_path, change_value=-1)

        current_file_path = task["file_path"]
        if current_file_path:
            if current_file_path != demo_exam_task_data.file_path:
                file_exists = await file_repository.delete_file_from_storage(session=session,
                                                                             file_path=current_file_path)

                if file_exists:
                    raise DeleteFileError
            else:
                if demo_exam_task_data.new_file_uploaded:
                    await file_repository.update_file_reference_count(session=session,
                                                                      file_path=current_file_path,
                                                                      change_value=-1)

        updated_demo_exam_task = self._demo_exam_task(
            descr=demo_exam_task_data.descr,
            image_path=demo_exam_task_data.image_path or self._get_random_default_image_path(self._default_demo_exam_image_directory),
            file_path=demo_exam_task_data.file_path,
            file_name=f"{demo_exam_task_data.file_name}.{demo_exam_task_data.file_path.split('.')[-1]}" if demo_exam_task_data.file_path else demo_exam_task_data.file_name
        )

        serialized_task = updated_demo_exam_task.dict()

        demo_exam_model.material[demo_exam_task_data.task_number] = serialized_task
        demo_exam_model.answers[demo_exam_task_data.task_number] = demo_exam_task_data.answer

        flag_modified(demo_exam_model, "material")
        flag_modified(demo_exam_model, "answers")
        session.add(demo_exam_model)

        return self._to_update_demo_exam_task_response(updated_task=updated_demo_exam_task, demo_exam_model=demo_exam_model, task_number=demo_exam_task_data.task_number)
