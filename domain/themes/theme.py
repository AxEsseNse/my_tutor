from pydantic import BaseModel
from typing import List


class CardTheory(BaseModel):
    card_id: int
    type: str
    title: str
    image_path: str
    descr: str


class CardPracticeTip(BaseModel):
    image_path: str
    descr: str


class CardPractice(BaseModel):
    card_id: int
    type: str
    title: str
    image_path: str
    descr: str
    file_path: str | None = None
    file_name: str | None = None
    answer: str
    tip: CardPracticeTip


class Theme(BaseModel):
    theme_id: int
    exam: str
    exam_task_number: int
    title: str
    descr: str
    material: List[CardPractice | CardTheory]


class ThemeInfo(BaseModel):
    theme_id: int
    exam: str
    exam_task_number: int
    title: str
    descr: str


class ThemeOption(BaseModel):
    id: int
    exam: str
    exam_task_number: int
    title: str


class ThemeStudyingStatus(BaseModel):
    theme_id: int
    status: str
    date: str


class ThemeDemo(BaseModel):
    theme: Theme
    progress_cards: dict
