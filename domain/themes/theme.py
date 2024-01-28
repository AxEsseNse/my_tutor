from pydantic import BaseModel


class Theme(BaseModel):
    theme_id: int
    exam: str
    title: str
    descr: str
