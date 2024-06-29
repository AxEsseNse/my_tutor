from sqlalchemy import Integer, Column, ForeignKey, Sequence, DateTime, Enum
from my_tutor.models import Base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from my_tutor.constants import DemoExamStatus


class DemoExamProgressModel(Base):
    __tablename__ = "demo_exam_progress"

    demo_exam_progress_id_seq = Sequence("demo_exam_progress_demo_exam_progress_id_seq")

    demo_exam_progress_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey(column="students.student_id"), nullable=False)
    demo_id = Column(Integer, ForeignKey(column="demo_exams.demo_exam_id"), nullable=False)
    status = Column(Enum(DemoExamStatus, name='demo_exam_status'), default=DemoExamStatus.CREATED, nullable=False)
    start_date = Column(DateTime(timezone=True))
    student_answers = Column(JSONB, server_default="{}")
    points = Column(JSONB, server_default="{}")
    result = Column(Integer, nullable=False)

    demo_exam = relationship("DemoExamModel", uselist=False)
