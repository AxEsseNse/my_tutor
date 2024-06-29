from pydantic import BaseModel


class DemoExamTask(BaseModel):
    demo_exam_task_id: int
    descr: str
    image_path: str
    file_path: str | None = None
    file_name: str | None = None
