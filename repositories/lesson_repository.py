from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from datetime import datetime

from my_tutor.exceptions import LessonAlreadyExistError, LessonNotFoundError
from my_tutor.models import LessonModel
from my_tutor.schemes import (
    AddLessonRequest,
    AddLessonResponse,
    DeleteLessonRequest,
    DeleteLessonResponse,
    FinishLessonRequest,
    FinishLessonResponse,
    PaidLessonRequest,
    PaidLessonResponse,
    StartLessonResponse,
    GetLessonStatusResponse
)
from my_tutor.domain import StudentLesson, TutorLesson
from my_tutor.constants import LessonStatus
RUS_EXAMS = {
    1: "ЕГЭ",
    2: "ОГЭ"
}


class LessonRepository:
    _student_lesson = StudentLesson
    _tutor_lesson = TutorLesson
    _lesson_model = LessonModel
    _date_pattern = "%d.%m.%Y %H:%M"
    _add_lesson_response = AddLessonResponse
    _delete_lesson_response = DeleteLessonResponse
    _finish_lesson_response = FinishLessonResponse
    _paid_lesson_response = PaidLessonResponse
    _start_lesson_response = StartLessonResponse
    _get_lesson_status_response = GetLessonStatusResponse

    def _to_get_lesson_status_response(self, lesson_model: LessonModel) -> GetLessonStatusResponse:

        return self._get_lesson_status_response(
            status=lesson_model.status
        )

    def _to_student_lesson(self, lesson_model: LessonModel) -> StudentLesson:

        return self._student_lesson(
            date=lesson_model.date.strftime(self._date_pattern),
            tutor=f"{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}",
            exam=RUS_EXAMS[lesson_model.theme.exam_id],
            exam_task_number=lesson_model.theme.exam_task_number,
            theme_title=lesson_model.theme.title,
            pay_status='Оплачено' if lesson_model.is_paid else 'Не оплачено'
        )

    def _to_tutor_lesson(self, lesson_model: LessonModel) -> TutorLesson:

        return self._tutor_lesson(
            date=lesson_model.date.strftime(self._date_pattern),
            student=f"{lesson_model.student.second_name} {lesson_model.student.first_name}",
            exam=RUS_EXAMS[lesson_model.theme.exam_id],
            exam_task_number=lesson_model.theme.exam_task_number,
            theme_title=lesson_model.theme.title,
            note=lesson_model.note
        )

    def _to_add_lesson_response(self, lesson_model: LessonModel) -> AddLessonResponse:

        return  self._add_lesson_response(
            tutor=f"{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}",
            student=f"{lesson_model.student.second_name} {lesson_model.student.first_name}",
            exam=RUS_EXAMS[lesson_model.theme.exam_id],
            exam_task_number=lesson_model.theme.exam_task_number,
            theme_title=lesson_model.theme.title,
            date=datetime.strftime(lesson_model.date, self._date_pattern),
            message="Новый урок зарегистрирован в системе"
        )

    def _to_delete_lesson_response(self, lesson_model: DeleteLessonRequest) -> DeleteLessonResponse:

        return self._delete_lesson_response(
            tutor=f"{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}",
            date=lesson_model.date,
            message="Урок успешно удален"
        )

    def _to_start_lesson_response(self) -> StartLessonResponse:
        return self._start_lesson_response(
            is_started=True
        )

    def _to_finish_lesson_response(self, lesson_model: LessonModel) -> FinishLessonResponse:

        return self._finish_lesson_response(
            tutor=f"{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}",
            student=f"{lesson_model.student.second_name} {lesson_model.student.first_name}",
            exam=RUS_EXAMS[lesson_model.theme.exam_id],
            exam_task_number=lesson_model.theme.exam_task_number,
            theme_title=lesson_model.theme.title,
            date=lesson_model.date,
            message="Урок отмечен в системе как завершенный"
        )

    def _to_paid_lesson_response(self, lesson_model: LessonModel) -> PaidLessonResponse:

        return self._paid_lesson_response(
            tutor=f"{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}",
            student=f"{lesson_model.student.second_name} {lesson_model.student.first_name}",
            date=lesson_model.date,
            message="Урок оплачен"
        )

    async def get_lesson_status(self, session: AsyncSession, lesson_id: int) -> GetLessonStatusResponse:
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_id))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        return self._to_get_lesson_status_response(lesson_model=lesson_model)

    async def get_current_user_lesson(self, session: AsyncSession, student_id: int | None = None, tutor_id: int | None = None) -> int | None:
        current_datetime = datetime.utcnow()

        if student_id:
            query = select(self._lesson_model).filter(
                self._lesson_model.student_id == student_id,
                self._lesson_model.status != LessonStatus.FINISHED,
                self._lesson_model.date < current_datetime
            )
        elif tutor_id:
            query = select(self._lesson_model).filter(
                self._lesson_model.tutor_id == tutor_id,
                self._lesson_model.status != LessonStatus.FINISHED,
                self._lesson_model.date < current_datetime
            )
        else:
            return None

        lesson_model = (await session.execute(query)).scalars().first()
        return lesson_model.lesson_id if lesson_model else None

    async def get_student_lessons(self, session: AsyncSession, student_id: int) -> list[StudentLesson]:
        lessons_models = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(student_id=student_id)
            .order_by(desc(self._lesson_model.date))
        )).scalars().all()

        return [self._to_student_lesson(lesson_model=lesson_model) for lesson_model in lessons_models]

    async def get_tutor_lessons(self, session: AsyncSession, tutor_id: int) -> list[TutorLesson]:
        lessons_models = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(tutor_id=tutor_id)
            .order_by(desc(self._lesson_model.date))
        )).scalars().all()

        return [self._to_tutor_lesson(lesson_model=lesson_model) for lesson_model in lessons_models]

    async def add_lesson(self, session: AsyncSession, lesson_data: AddLessonRequest) -> AddLessonResponse:
        lesson_datetime = datetime.strptime(lesson_data.date, self._date_pattern)
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(tutor_id=lesson_data.tutor_id, student_id=lesson_data.student_id, theme_id=lesson_data.theme_id, date=lesson_datetime))).scalars().first()

        if lesson_model:
            raise LessonAlreadyExistError

        new_lesson = self._lesson_model(
            tutor_id=lesson_data.tutor_id,
            student_id=lesson_data.student_id,
            theme_id=lesson_data.theme_id,
            date=datetime.strptime(lesson_data.date, self._date_pattern)
        )

        session.add(new_lesson)
        await session.flush()

        new_lesson_data = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(lesson_id=new_lesson.lesson_id)
            .order_by(desc(self._lesson_model.date))
        )).scalars().first()

        return self._to_add_lesson_response(lesson_model=new_lesson_data)

    async def delete_lesson(self, session: AsyncSession, lesson_data: DeleteLessonRequest) -> DeleteLessonResponse:
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(tutor_id=lesson_data.tutor_id, date=lesson_data.date))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        delete_lesson_response = self._to_delete_lesson_response(lesson_model=lesson_model)
        await session.delete(lesson_model)

        return delete_lesson_response

    async def start_lesson(self, session: AsyncSession, lesson_id: int) -> StartLessonResponse:
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_id))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        lesson_model.status = LessonStatus.STARTED
        session.add(lesson_model)

        return self._to_start_lesson_response()

    async def finish_lesson(self, session: AsyncSession, lesson_data: FinishLessonRequest) -> FinishLessonResponse:
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_data.lesson_id))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        lesson_model.note = lesson_data.note
        lesson_model.status = LessonStatus.FINISHED
        session.add(lesson_model)

        return self._to_finish_lesson_response(lesson_model=lesson_model)

    async def set_paid_status_lesson(self, session: AsyncSession, lesson_data: PaidLessonRequest) -> PaidLessonResponse:
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_data.lesson_id))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        lesson_model.is_paid = True
        session.add(lesson_model)

        return self._to_paid_lesson_response(lesson_model=lesson_model)

    async def authorize_lesson(self, session: AsyncSession, lesson_id: int, student_id: int | None = None, tutor_id: int | None = None) -> bool:
        lesson_model = None

        if student_id:
            lesson_model = (
                await session.execute(
                    select(self._lesson_model).filter_by(lesson_id=lesson_id, student_id=student_id))).scalars().first()
        elif tutor_id:
            lesson_model = (
                await session.execute(
                    select(self._lesson_model).filter_by(lesson_id=lesson_id, tutor_id=tutor_id))).scalars().first()

        if lesson_model:
            return True

        return False

    async def is_available_lesson(self, session: AsyncSession, lesson_id: int) -> bool:
        current_datetime = datetime.utcnow()

        query = select(self._lesson_model).filter(
            self._lesson_model.lesson_id == lesson_id,
            self._lesson_model.status != LessonStatus.FINISHED,
            self._lesson_model.date < current_datetime
        )

        lesson_model = (await session.execute(query)).scalars().first()

        return True if lesson_model else False
