from pydantic import BaseModel, Field
from typing import Optional


class AddThemePracticeCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    title: str
    descr: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    answer: str
    file_path: Optional[str] = Field(None, alias="filePath")
    file_name: Optional[str] = Field(None, alias="fileName")
    tip_image_path: Optional[str] = Field(None, alias="tipImagePath")
    tip_descr: Optional[str] = Field(None, alias="tipDescr")
    card_position: int = Field(alias="cardPosition")


class AddThemeTheoryCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    title: str
    descr: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    card_position: int = Field(alias="cardPosition")


class AddThemeCardResponse(BaseModel):
    message: str
