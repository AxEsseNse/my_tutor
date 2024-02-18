from pydantic import BaseModel, Field


class FinishLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    note: str


class FinishLessonResponse(BaseModel):
    tutor: str
    student: str
    exam: str
    exam_task_number: int
    theme_title: str
    date: str
    message: str
