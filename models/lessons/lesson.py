from sqlalchemy import Integer, Column, String, ForeignKey, Sequence, DateTime, Boolean, text, Enum
from sqlalchemy.orm import relationship
from my_tutor.models import Base
from my_tutor.constants import LessonStatus


class LessonModel(Base):
    __tablename__ = "lessons"

    lesson_id_seq = Sequence("lessons_lesson_id_seq")

    lesson_id = Column(Integer, primary_key=True)
    tutor_id = Column(Integer, ForeignKey(column="tutors.tutor_id"), nullable=False)
    student_id = Column(Integer, ForeignKey(column="students.student_id"), nullable=False)
    theme_id = Column(Integer, ForeignKey(column="themes.theme_id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    note = Column(String, default='Заметок нет', server_default=text("'Заметок нет'"))
    status = Column(Enum(LessonStatus, name='lesson_status'), default=LessonStatus.CREATED, nullable=False)
    start_date = Column(DateTime(timezone=True))
    is_paid = Column(Boolean, default=False, nullable=False)

    tutor = relationship("TutorModel", uselist=False)
    student = relationship("StudentModel", uselist=False)
    theme = relationship("ThemeModel", uselist=False)
