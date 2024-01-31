from pydantic import BaseModel, Field


class DeleteThemeMaterialRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    card: int


class DeleteThemeMaterialResponse(BaseModel):
    exam: str
    title: str
    card: int
    type_card: str
    message: str
