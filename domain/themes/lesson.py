from pydantic import BaseModel
from .theme import Theme


class Lesson(BaseModel):
    student_id: int
    progress_cards: dict
    theme: Theme
