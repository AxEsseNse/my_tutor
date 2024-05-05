from sqlalchemy import select, desc, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, Session
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from my_tutor.exceptions import (
    LessonAlreadyExistError,
    LessonNotFoundError,
    LessonAlreadyFinished,
    LessonNotStarted,
    StudentAlreadyHasLesson,
    TutorAlreadyHasLesson
)
from my_tutor.models import LessonModel, StudyingModel
from my_tutor.schemes import (
    AddLessonRequest,
    AddLessonResponse,
    DeleteLessonRequest,
    DeleteLessonResponse,
    FinishLessonRequest,
    FinishLessonResponse,
    ChangeLessonPaidStatusRequest,
    ChangeLessonPaidStatusResponse,
    StartLessonResponse,
    GetLessonStatusResponse,
    CancelLessonRequest,
    CancelLessonResponse,
    RescheduleLessonRequest,
    RescheduleLessonResponse,
    UpdateNoteLessonRequest,
    UpdateNoteLessonResponse
)
from my_tutor.domain import StudentLesson, TutorLesson
from my_tutor.constants import LessonStatus


moscow_tz = ZoneInfo('Europe/Moscow')
RUS_EXAMS = {
    1: "ЕГЭ",
    2: "ОГЭ"
}
THEME_STATUSES = {
    "PLANNED": 1,
    "COMPLETED": 2,
    "IN PROGRESS": 3
}


class LessonRepository:
    _student_lesson = StudentLesson
    _tutor_lesson = TutorLesson
    _lesson_model = LessonModel
    _studying_model = StudyingModel
    _date_pattern = "%d.%m.%Y %H:%M"
    _add_lesson_response = AddLessonResponse
    _delete_lesson_response = DeleteLessonResponse
    _finish_lesson_response = FinishLessonResponse
    _update_lesson_note_response = UpdateNoteLessonResponse
    _change_lesson_paid_status_response = ChangeLessonPaidStatusResponse
    _start_lesson_response = StartLessonResponse
    _cancel_lesson_response = CancelLessonResponse
    _reschedule_lesson_response = RescheduleLessonResponse
    _get_lesson_status_response = GetLessonStatusResponse

    def _to_get_lesson_status_response(self, lesson_model: LessonModel) -> GetLessonStatusResponse:
        if lesson_model.start_date is not None:
            time_left = int(3300 - (datetime.now(moscow_tz) - lesson_model.start_date).total_seconds())

            if time_left < 0:
                time_left = 0
        else:
            time_left = 3300

        return self._get_lesson_status_response(
            status=lesson_model.status,
            time_left=time_left
        )

    def _to_student_lesson(self, lesson_model: LessonModel) -> StudentLesson:

        return self._student_lesson(
            date=lesson_model.date.strftime(self._date_pattern),
            tutor=f"{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}",
            exam=RUS_EXAMS[lesson_model.theme.exam_id],
            exam_task_number=lesson_model.theme.exam_task_number,
            theme_title=lesson_model.theme.title,
            pay_status=lesson_model.is_paid
        )

    def _to_tutor_lesson(self, lesson_model: LessonModel) -> TutorLesson:

        return self._tutor_lesson(
            lesson_id=lesson_model.lesson_id,
            date=datetime.strftime(lesson_model.date.astimezone(moscow_tz), self._date_pattern),
            student=f"{lesson_model.student.second_name} {lesson_model.student.first_name}",
            exam=RUS_EXAMS[lesson_model.theme.exam_id],
            exam_task_number=lesson_model.theme.exam_task_number,
            theme_title=lesson_model.theme.title,
            note=lesson_model.note,
            status=lesson_model.status,
            pay_status=lesson_model.is_paid
        )

    def _to_add_lesson_response(self, lesson_model: LessonModel) -> AddLessonResponse:

        return self._add_lesson_response(
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
            date=datetime.strftime(lesson_model.date, self._date_pattern),
            message="Урок завершен с пометкой 'Проведен'" if lesson_model.status == LessonStatus.FINISHED else "Урок завершен с пометкой 'Отменен'"
        )

    def _to_update_lesson_note_response(self, lesson_model: LessonModel) -> UpdateNoteLessonResponse:

        return self._update_lesson_note_response(
            note=lesson_model.note,
            message=f'Заметка урока преподавателя "{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}" со студентом "{lesson_model.student.second_name} {lesson_model.student.first_name}" {datetime.strftime(lesson_model.date, self._date_pattern)} по теме "{lesson_model.theme.title}" обновлена на "{lesson_model.note}"'
        )

    def _to_change_lesson_paid_status_response(self, lesson_model: LessonModel) -> ChangeLessonPaidStatusResponse:

        return self._change_lesson_paid_status_response(
            pay_status=lesson_model.is_paid,
            message=f'Статус урока преподавателя "{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}" со студентом "{lesson_model.student.second_name} {lesson_model.student.first_name}" {datetime.strftime(lesson_model.date, self._date_pattern)} по теме "{lesson_model.theme.title}" установлен в - {"ОПЛАЧЕН" if lesson_model.is_paid else "НЕ ОПЛАЧЕН"}'
        )

    def _to_cancel_lesson_response(self, lesson_model: LessonModel) -> CancelLessonResponse:

        return self._cancel_lesson_response(
            status=lesson_model.status,
            message=f'Урок преподавателя "{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}" со студентом "{lesson_model.student.second_name} {lesson_model.student.first_name}" {datetime.strftime(lesson_model.date, self._date_pattern)} по теме "{lesson_model.theme.title}" ОТМЕНЕН'
        )

    def _to_reschedule_lesson_response(self, lesson_model: LessonModel, changed_date) -> RescheduleLessonResponse:

        return self._reschedule_lesson_response(
            date=datetime.strftime(lesson_model.date, self._date_pattern),
            message=f'Урок преподавателя "{lesson_model.tutor.second_name} {lesson_model.tutor.first_name}" со студентом "{lesson_model.student.second_name} {lesson_model.student.first_name}" по теме "{lesson_model.theme.title}" ПЕРЕНЕСЕН с {datetime.strftime(changed_date, self._date_pattern)} на {datetime.strftime(lesson_model.date, self._date_pattern)}'
        )

    async def get_lesson_status(self, session: AsyncSession, lesson_id: int) -> GetLessonStatusResponse:
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_id))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        return self._to_get_lesson_status_response(lesson_model=lesson_model)

    async def get_current_user_lesson(self, session: AsyncSession, student_id: int | None = None, tutor_id: int | None = None) -> int | None:

        if student_id:
            query = select(self._lesson_model).filter(
                self._lesson_model.student_id == student_id,
                or_(
                    self._lesson_model.status == LessonStatus.STARTED,
                    self._lesson_model.status == LessonStatus.CREATED
                ),
                self._lesson_model.date < datetime.now(moscow_tz)
            )
        elif tutor_id:
            query = select(self._lesson_model).filter(
                self._lesson_model.tutor_id == tutor_id,
                or_(
                    self._lesson_model.status == LessonStatus.STARTED,
                    self._lesson_model.status == LessonStatus.CREATED
                ),
                self._lesson_model.date < datetime.now(moscow_tz)
            )
        else:
            return None

        lesson_model = (await session.execute(query)).scalars().first()
        return lesson_model.lesson_id if lesson_model else None

    async def get_lesson_theme_id(self, session: AsyncSession, lesson_id: int) -> (int, int):
        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_id))).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        return lesson_model.theme_id, lesson_model.student_id

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
        aware_datetime = datetime.strptime(lesson_data.date, self._date_pattern).replace(tzinfo=moscow_tz)

        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(tutor_id=lesson_data.tutor_id, student_id=lesson_data.student_id, theme_id=lesson_data.theme_id, date=aware_datetime))).scalars().first()

        if lesson_model:
            raise LessonAlreadyExistError

        previous_hour = aware_datetime - timedelta(minutes=59)
        next_hour = aware_datetime + timedelta(minutes=59)

        tutor_lessons = (
            await session.execute(
                select(self._lesson_model)
                .filter(
                    self._lesson_model.tutor_id == lesson_data.tutor_id,
                    and_(
                        self._lesson_model.date >= previous_hour,
                        self._lesson_model.date <= next_hour
                    )
                )
            )
        ).scalars().first()

        if tutor_lessons:
            raise TutorAlreadyHasLesson

        student_lessons = (
            await session.execute(
                select(self._lesson_model)
                .filter(
                    self._lesson_model.student_id == lesson_data.student_id,
                    and_(
                        self._lesson_model.date >= previous_hour,
                        self._lesson_model.date <= next_hour
                    )
                )
            )
        ).scalars().first()

        if student_lessons:
            raise StudentAlreadyHasLesson

        new_lesson = self._lesson_model(
            tutor_id=lesson_data.tutor_id,
            student_id=lesson_data.student_id,
            theme_id=lesson_data.theme_id,
            note="Урок не завершен",
            date=aware_datetime
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
        )).scalars().first()

        studying_model = (
            await session.execute(select(self._studying_model).filter_by(student_id=lesson_data.student_id,
                                                                         theme_id=lesson_data.theme_id))).scalars().first()

        if not studying_model:
            studying_model = self._studying_model(
                student_id=lesson_data.student_id,
                theme_id=lesson_data.theme_id,
                date=aware_datetime,
                theme_status_id=THEME_STATUSES["PLANNED"]
            )
            session.add(studying_model)

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
        lesson_model.start_date = datetime.now(moscow_tz)
        session.add(lesson_model)

        return self._to_start_lesson_response()

    async def finish_lesson(self, session: AsyncSession, lesson_data: FinishLessonRequest) -> FinishLessonResponse:
        lesson_model = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(lesson_id=lesson_data.lesson_id)
        )).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        lesson_model.note = lesson_data.note
        lesson_model.status = lesson_data.lesson_status
        session.add(lesson_model)

        studying_model = (
            await session.execute(select(self._studying_model).filter_by(student_id=lesson_data.student_id,
                                                                         theme_id=lesson_data.theme_id))).scalars().first()

        if studying_model:
            studying_model.date = lesson_model.date
            studying_model.progress_cards = lesson_data.progress_cards
            studying_model.theme_status_id = THEME_STATUSES[lesson_data.theme_status]
        else:
            studying_model = self._studying_model(
                student_id=lesson_data.student_id,
                theme_id=lesson_data.theme_id,
                date=lesson_model.date,
                theme_status_id=THEME_STATUSES[lesson_data.theme_status],
                progress_cards=lesson_data.progress_cards
            )

        session.add(studying_model)

        return self._to_finish_lesson_response(lesson_model=lesson_model)

    @staticmethod
    def auto_finish_lesson(session: Session, lesson_id: int) -> bool:
        lesson_model = session.query(LessonModel).filter_by(lesson_id=lesson_id).first()

        if not lesson_model:
            raise LessonNotFoundError

        if lesson_model.status != LessonStatus.STARTED:
            raise LessonNotStarted

        if lesson_model.status == LessonStatus.FINISHED or lesson_model.status == LessonStatus.CANCELED:
            raise LessonAlreadyFinished

        lesson_model.note = "Завершен автоматически"
        lesson_model.status = LessonStatus.FINISHED
        session.add(lesson_model)

        return True

    async def cancel_lesson(self, session: AsyncSession, lesson_data: CancelLessonRequest) -> CancelLessonResponse:
        lesson_model = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(lesson_id=lesson_data.lesson_id)
        )).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        lesson_model.status = LessonStatus.CANCELED
        lesson_model.note = "ОТМЕНЕН"

        studying_model = (
            await session.execute(select(self._studying_model).filter_by(student_id=lesson_model.student_id,
                                                                         theme_id=lesson_model.theme_id))).scalars().first()

        if studying_model.theme_status_id == 1:
            await session.delete(studying_model)

        return self._to_cancel_lesson_response(lesson_model=lesson_model)

    async def reschedule_lesson(self, session: AsyncSession, lesson_data: RescheduleLessonRequest) -> RescheduleLessonResponse:
        aware_datetime = datetime.strptime(lesson_data.new_date, self._date_pattern).replace(tzinfo=moscow_tz)

        lesson_model = (
            await session.execute(select(self._lesson_model).filter_by(lesson_id=lesson_data.lesson_id))).scalars().first()

        previous_hour = aware_datetime - timedelta(minutes=59)
        next_hour = aware_datetime + timedelta(minutes=59)

        tutor_lessons = (
            await session.execute(
                select(self._lesson_model)
                .filter(
                    self._lesson_model.tutor_id == lesson_model.tutor_id,
                    and_(
                        self._lesson_model.date >= previous_hour,
                        self._lesson_model.date <= next_hour
                    ),
                    or_(
                        self._lesson_model.status == LessonStatus.STARTED,
                        self._lesson_model.status == LessonStatus.CREATED
                    )
                )
            )
        ).scalars().all()

        for tutor_lesson in tutor_lessons:
            if tutor_lesson.lesson_id != lesson_model.lesson_id:
                raise TutorAlreadyHasLesson

        student_lessons = (
            await session.execute(
                select(self._lesson_model)
                .filter(
                    self._lesson_model.student_id == lesson_model.student_id,
                    and_(
                        self._lesson_model.date >= previous_hour,
                        self._lesson_model.date <= next_hour
                    ),
                    or_(
                        self._lesson_model.status == LessonStatus.STARTED,
                        self._lesson_model.status == LessonStatus.CREATED
                    )
                )
            )
        ).scalars().all()

        for student_lesson in student_lessons:
            if student_lesson.lesson_id != lesson_model.lesson_id:
                raise StudentAlreadyHasLesson

        changed_date = lesson_model.date

        lesson_model.date = aware_datetime
        session.add(lesson_model)
        await session.flush()

        lesson_data = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(lesson_id=lesson_model.lesson_id)
        )).scalars().first()

        studying_model = (
            await session.execute(select(self._studying_model).filter_by(student_id=lesson_data.student_id,
                                                                         theme_id=lesson_data.theme_id))).scalars().first()

        if studying_model.theme_status_id == 1:
            studying_model.date = lesson_data.date
            session.add(studying_model)

        return self._to_reschedule_lesson_response(lesson_model=lesson_data, changed_date=changed_date)

    async def change_paid_status_lesson(self, session: AsyncSession, lesson_data: ChangeLessonPaidStatusRequest) -> ChangeLessonPaidStatusResponse:
        lesson_model = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(lesson_id=lesson_data.lesson_id)
        )).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        if lesson_model.is_paid:
            lesson_model.is_paid = False
        else:
            lesson_model.is_paid = True
        session.add(lesson_model)

        return self._to_change_lesson_paid_status_response(lesson_model=lesson_model)

    async def update_lesson_note(self, session: AsyncSession, lesson_data: UpdateNoteLessonRequest) -> UpdateNoteLessonResponse:
        lesson_model = (await session.execute(
            select(self._lesson_model)
            .options(
                selectinload(self._lesson_model.tutor),
                selectinload(self._lesson_model.student),
                selectinload(self._lesson_model.theme)
            )
            .filter_by(lesson_id=lesson_data.lesson_id)
        )).scalars().first()

        if not lesson_model:
            raise LessonNotFoundError

        lesson_model.note = lesson_data.note
        session.add(lesson_model)

        return self._to_update_lesson_note_response(lesson_model=lesson_model)


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

        query = select(self._lesson_model).filter(
            self._lesson_model.lesson_id == lesson_id,
            or_(
                self._lesson_model.status == LessonStatus.STARTED,
                self._lesson_model.status == LessonStatus.CREATED
            ),
            self._lesson_model.date < datetime.now(moscow_tz)
        )

        lesson_model = (await session.execute(query)).scalars().first()

        return True if lesson_model else False
