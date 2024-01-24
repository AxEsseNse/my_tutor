from pydantic import BaseModel, Field


class UpdateParentRequest(BaseModel):
    student_login: str = Field(alias="studentLogin")
    status: str
    first_name: str = Field(alias="firstName")
    second_name: str = Field(alias="secondName")
    phone_key: str = Field(alias="phoneKey")
    new_phone: str
    telegram: str
    whatsapp: str = Field(alias="whatsApp")


class UpdateParentResponse(BaseModel):
    status: str
    first_name: str
    second_name: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
