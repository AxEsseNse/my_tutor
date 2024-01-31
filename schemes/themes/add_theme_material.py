from pydantic import BaseModel, Field
from typing import Optional


class AddThemeMaterialTheoryRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    position: int
    type: str = 'theory'
    title: str
    image_path: str = Field(alias="imagePath")
    descr: str


class AddThemeMaterialPracticeRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    position: int
    type: str = 'practice'
    title: str
    image_path: str = Field(alias="imagePath")
    descr: str
    answer: str
    tip: bool
    tip_image_path: Optional[str] = Field(None, alias="tipImagePath")
    tip_descr: Optional[str] = Field(None, alias="tipDescr")


class AddThemeMaterialResponse(BaseModel):
    exam: str
    title: str
    message: str
