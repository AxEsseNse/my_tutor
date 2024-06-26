from pydantic import BaseModel


class Student(BaseModel):
    student_id: int
    img_path: str
    second_name: str
    first_name: str
    gender: str
    birthday: str
    lesson_price: int
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class StudentInfo(BaseModel):
    login: str
    first_name: str
    second_name: str
    gender: str
    birthday: str
    lesson_price: int
    img_path: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class StudentOption(BaseModel):
    id: int
    name: str


class StudentId(BaseModel):
    student_id: int
    message: str
