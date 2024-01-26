from pydantic import BaseModel


class DeleteThemeRequest(BaseModel):
    title: str


class DeleteThemeResponse(BaseModel):
    exam: str
    title: str
    message: str
