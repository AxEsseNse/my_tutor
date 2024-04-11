from pydantic import BaseModel, Field


class UpdateNoteLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    note: str


class UpdateNoteLessonResponse(BaseModel):
    note: str
    message: str


class RescheduleLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    new_date: str = Field(alias="newDate")


class RescheduleLessonResponse(BaseModel):
    date: str
    message: str


class CancelLessonRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    cancel: bool


class CancelLessonResponse(BaseModel):
    status: str
    message: str


class ChangeLessonPaidStatusRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    paid_request: bool = Field(alias="paidRequest")


class ChangeLessonPaidStatusResponse(BaseModel):
    pay_status: bool
    message: str


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
