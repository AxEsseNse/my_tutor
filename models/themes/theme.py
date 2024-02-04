from sqlalchemy import Integer, Column, String, ForeignKey, Sequence
from my_tutor.models import Base
from sqlalchemy.dialects.postgresql import JSONB


class ThemeModel(Base):
    __tablename__ = "themes"

    theme_id_seq = Sequence("themes_theme_id_seq")
    theme_practice_material_id_seq = Sequence('themes_theme_practice_material_id_seq')

    theme_id = Column(Integer, primary_key=True)
    exam_id = Column(Integer, ForeignKey(column="exams.exam_id"), nullable=False)
    exam_task_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    descr = Column(String, nullable=False)
    material = Column(JSONB, server_default="{}")
