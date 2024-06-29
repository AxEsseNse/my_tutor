from pydantic import BaseModel, Field
from typing import Optional


class AddDemoExamTaskRequest(BaseModel):
    demo_exam_id: int = Field(alias="demoExamId")
    task_number: str = Field(alias="taskNumber")
    descr: str
    image_path: Optional[str] = Field(None, alias="imagePath")
    answer: str
    file_path: Optional[str] = Field(None, alias="filePath")
    file_name: Optional[str] = Field(None, alias="fileName")


class AddDemoExamTaskResponse(BaseModel):
    image_path: Optional[str] = None
    file_path: Optional[str] = None
    message: str
