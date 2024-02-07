from pydantic import BaseModel, Field


class DeleteThemeRequest(BaseModel):
    theme_id: int = Field(alias="themeId")


class DeleteThemeResponse(BaseModel):
    exam: str
    title: str
    message: str
