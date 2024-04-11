from pydantic import BaseModel, Field
from typing import Optional


class UpdateThemePracticeCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    card_id: int = Field(alias="cardId")
    current_position: int = Field(alias="currentPosition")
    new_position: int = Field(alias="newPosition")
    title: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    descr: str
    answer: str
    #tip: bool
    tip_image_path: Optional[str] = Field(None, alias="tipImagePath")
    tip_descr: Optional[str] = Field(None, alias="tipDescr")


class UpdateThemeTheoryCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    card_id: int = Field(alias="cardId")
    current_position: int = Field(alias="currentPosition")
    new_position: int = Field(alias="newPosition")
    title: str
    descr: str
    image_path: Optional[str] = Field(None, alias="imagePath")


class UpdateThemeCardResponse(BaseModel):
    message: str
