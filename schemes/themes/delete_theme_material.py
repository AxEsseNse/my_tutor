from pydantic import BaseModel, Field


class DeleteThemeCardRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    card_id: int = Field(alias="cardId")
    card_position: int = Field(alias="cardPosition")


class DeleteThemeCardResponse(BaseModel):
    message: str
