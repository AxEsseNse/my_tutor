from sqlalchemy import Integer, Column, String, Sequence
from my_tutor.models import Base


class ThemeStatusModel(Base):
    __tablename__ = "themes_statuses"

    theme_status_id_seq = Sequence("themes_statuses_theme_status_id_seq")

    theme_status_id = Column(Integer, primary_key=True)
    title = Column(String(length=11), nullable=False)
