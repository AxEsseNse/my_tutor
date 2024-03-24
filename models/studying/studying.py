from sqlalchemy import Integer, Column, ForeignKey, Sequence, DateTime
from my_tutor.models import Base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class StudyingModel(Base):
    __tablename__ = "studying"

    studying_id_seq = Sequence("studying_studying_id_seq")

    studying_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey(column="students.student_id"), nullable=False)
    theme_id = Column(Integer, ForeignKey(column="themes.theme_id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    theme_status_id = Column(Integer, ForeignKey(column="themes_statuses.theme_status_id"), nullable=False)
    progress_cards = Column(JSONB, server_default="{}")

    theme = relationship("ThemeModel", uselist=False)
    theme_status = relationship("ThemeStatusModel", uselist=False)
