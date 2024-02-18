from pydantic import BaseModel


class Tutor(BaseModel):
    img_path: str
    second_name: str
    first_name: str
    gender: str
    age: int
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class TutorInfo(BaseModel):
    login: str
    first_name: str
    second_name: str
    gender: str
    birthday: str
    img_path: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class TutorOption(BaseModel):
    id: int
    name: str
