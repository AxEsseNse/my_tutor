from pydantic import BaseModel, Field


class FinishLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    student_id: int = Field(alias="studentId")
    theme_id: int = Field(alias="themeId")
    theme_status: str = Field(alias="themeStatus")
    progress_cards: dict = Field(alias="progressCards")
    lesson_status: str = Field(alias="lessonStatus")
    note: str


class FinishLessonResponse(BaseModel):
    tutor: str
    student: str
    exam: str
    exam_task_number: int
    theme_title: str
    date: str
    message: str
