from pydantic import BaseModel


class Theme(BaseModel):
    exam: str
    title: str
    descr: str
