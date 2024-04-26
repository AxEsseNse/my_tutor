from pydantic import BaseModel, Field
from typing import Optional


class UpdateThemePracticeCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    card_id: int = Field(alias="cardId")
    current_position: int = Field(alias="currentPosition")
    new_position: int = Field(alias="newPosition")
    title: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    new_image_uploaded: bool = Field(alias="newImageUploaded")
    descr: str
    answer: str
    file_path: Optional[str] = Field(None, alias="filePath")
    new_file_uploaded: bool = Field(alias="newFileUploaded")
    file_name: Optional[str] = Field(None, alias="fileName")
    tip_image_path: Optional[str] = Field(None, alias="tipImagePath")
    new_tip_image_uploaded: bool = Field(alias="newTipImageUploaded")
    tip_descr: Optional[str] = Field(None, alias="tipDescr")


class UpdateThemeTheoryCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    card_id: int = Field(alias="cardId")
    current_position: int = Field(alias="currentPosition")
    new_position: int = Field(alias="newPosition")
    title: str
    descr: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    new_image_uploaded: bool = Field(alias="newImageUploaded")


class UpdateThemeCardResponse(BaseModel):
    message: str
    image_path: Optional[str] = None
    tip_image_path: Optional[str] = None
