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
    type: str
    title: str
    image_path: str
    descr: str
    answer: str
    tip: MaterialPracticeTip | None


class Lesson(BaseModel):
    exam: str
    title: str
    material: List[MaterialTheory | MaterialPractice]
    message: str



__material_theory = {
    'type': 'theory',
    'title': 'Метод триад',
    'image_path': '/storage/themes/oge10/triada.jpg',
    'descr': 'Метод триад очень легок в освоении и чрезвычайно полезен на практике'
}

__material_practice = {
    'type': 'practice',
    'title': 'Задача № 4',
    'image_path': '/storage/themes/oge10/practice4.jpg',
    'descr': 'Найдите наименьшее число из представленных на изображении',
    'answer': '79',
    'tip_image_path': '/storage/themes/oge10/practice4tip.jpg',
    'tip_descr': 'Нужно перевести все числа в десятичную систему и сравнить',
}