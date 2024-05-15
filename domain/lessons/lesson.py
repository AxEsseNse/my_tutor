from pydantic import BaseModel


class StudentLesson(BaseModel):
    lesson_id: int
    date: str
    tutor: str
    exam: str
    exam_task_number: int
    theme_title: str
    status: str
    pay_status: bool


class TutorLesson(BaseModel):
    lesson_id: int
    date: str
    student_name: str
    student_id: int
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
