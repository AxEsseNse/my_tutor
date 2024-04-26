from sqlalchemy import Integer, Column, String, Sequence
from my_tutor.models import Base


class FileModel(Base):
    __tablename__ = "files"

    file_id_seq = Sequence("files_file_id_seq")

    file_id = Column(Integer, primary_key=True)
    file_path = Column(String, nullable=False, unique=True)
    ref_count = Column(Integer, nullable=False)
