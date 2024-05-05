from pydantic import BaseModel


class StudentLesson(BaseModel):
    date: str
    tutor: str
    exam: str
    exam_task_number: int
    theme_title: str
    pay_status: bool


class TutorLesson(BaseModel):
    lesson_id: int
    date: str
    student: str
    exam: str
    exam_task_number: int
    theme_title: str
    note: str
    status: str
    pay_status: bool


class LessonOptions(BaseModel):
    tutor: int | list
    student: int | list
    theme: int | list
