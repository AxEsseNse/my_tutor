from pydantic import BaseModel
from typing import List


class MaterialTheory(BaseModel):
    type: str
    title: str
    image_path: str
    descr: str


class MaterialPracticeTip(BaseModel):
    image_path: str
    descr: str


class MaterialPractice(BaseModel):
    id: int
    type: str
    title: str
    image_path: str
    descr: str
    answer: str
    tip: MaterialPracticeTip | None


class Lesson(BaseModel):
    exam: str
    exam_task_number: int
    title: str
    material: List[MaterialPractice | MaterialTheory]
    message: str
