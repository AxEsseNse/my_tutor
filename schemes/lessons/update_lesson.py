from pydantic import BaseModel, Field


class PaidLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")


class PaidLessonResponse(BaseModel):
    tutor: str
    student: str
    date: str
    message: str
