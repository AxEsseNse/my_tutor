from pydantic import BaseModel
from my_tutor.constants import LessonStatus


class GetLessonStatusResponse(BaseModel):
    status: LessonStatus
    time_left: int
