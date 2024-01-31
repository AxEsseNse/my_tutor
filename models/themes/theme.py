from sqlalchemy import Integer, Column, String, ForeignKey, Sequence
from my_tutor.models import Base
from sqlalchemy.dialects.postgresql import JSONB


class ThemeModel(Base):
    __tablename__ = "themes"

    id_seq = Sequence("themes_theme_id_seq")

    theme_id = Column(Integer, primary_key=True)
    exam_id = Column(Integer, ForeignKey(column="exams.exam_id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    descr = Column(String, nullable=False)
    material = Column(JSONB, server_default="{}")
