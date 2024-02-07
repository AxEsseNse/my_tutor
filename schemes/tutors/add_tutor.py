from pydantic import BaseModel, Field


class AddTutorRequest(BaseModel):
    tutor_login: str = Field(alias="tutorLogin")
    first_name: str = Field(alias="firstName")
    second_name: str = Field(alias="secondName")
    gender: str
    birthday: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str = Field(alias="whatsApp")


class AddTutorResponse(BaseModel):
    tutor_login: str
    img_path: str
    second_name: str
    first_name: str
    gender: str
    age: int
    discord: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
