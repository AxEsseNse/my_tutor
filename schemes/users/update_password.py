from pydantic import BaseModel, Field


class UpdateUserPasswordRequest(BaseModel):
    user_id: int = Field(alias="userId")
    current_password: str = Field(alias="currentPassword")
    new_password: str = Field(alias="newPassword")


class UpdateUserPasswordByAdminRequest(BaseModel):
    user_id: int = Field(alias="userId")
    login: str
    new_password: str = Field(alias="newPassword")


class UpdateUserPasswordResponse(BaseModel):
    login: str
    new_password: str
    message: str
