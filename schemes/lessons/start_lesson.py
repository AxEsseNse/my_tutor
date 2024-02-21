from pydantic import BaseModel


class StartLessonResponse(BaseModel):
    is_started: bool
