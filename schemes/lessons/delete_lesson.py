from pydantic import BaseModel, Field


class DeleteLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    tutor_id: int = Field(alias="tutorId")
    date: str


class DeleteLessonResponse(BaseModel):
    tutor: str
    date: str
    message: str
