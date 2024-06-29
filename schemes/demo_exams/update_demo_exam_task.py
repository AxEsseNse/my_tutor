from pydantic import BaseModel, Field
from typing import Optional


class UpdateDemoExamTaskRequest(BaseModel):
    demo_exam_id: int = Field(alias="demoExamId")
    task_number: str = Field(alias="taskNumber")
    current_position: int = Field(alias="currentPosition")
    new_position: int = Field(alias="newPosition")
    title: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    new_image_uploaded: bool = Field(alias="newImageUploaded")
    descr: str
    answer: str
    file_path: Optional[str] = Field(None, alias="filePath")
    new_file_uploaded: bool = Field(alias="newFileUploaded")
    file_name: Optional[str] = Field(None, alias="fileName")
    tip_image_path: Optional[str] = Field(None, alias="tipImagePath")
    new_tip_image_uploaded: bool = Field(alias="newTipImageUploaded")
    tip_descr: Optional[str] = Field(None, alias="tipDescr")


class UpdateDemoExamTaskResponse(BaseModel):
    message: str
    image_path: Optional[str] = None
    tip_image_path: Optional[str] = None
    file_path: Optional[str] = None
