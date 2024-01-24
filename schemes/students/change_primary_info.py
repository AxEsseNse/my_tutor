from pydantic import BaseModel, Field


class ChangeStudentPrimaryInfoRequest(BaseModel):
    login: str
    first_name: str = Field(alias="firstName")
    second_name: str = Field(alias="secondName")
    gender: str
    birthday: str


class StudentPrimaryInfoResponse(BaseModel):
    first_name: str
    second_name: str
    gender: str
    birthday: str
    message: str
