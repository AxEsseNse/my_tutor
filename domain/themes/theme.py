from pydantic import BaseModel


class Theme(BaseModel):
    theme_id: int
    exam: str
    exam_task_number: int
    title: str
    descr: str
