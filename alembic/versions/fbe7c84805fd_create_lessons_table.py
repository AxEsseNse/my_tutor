"""create lessons table

Revision ID: fbe7c84805fd
Revises: f73374f24848
Create Date: 2024-02-07 15:41:34.388654

"""
from os import getenv
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fbe7c84805fd'
down_revision: Union[str, None] = 'f73374f24848'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

app_type = getenv('APPTYPE', 'development')
TEST_STUDENT_ID = 1
TEST_TUTOR_ID = 1
TEST_THEME_ID = 3
LessonStatus = sa.Enum('CREATED', 'STARTED', 'CANCELED', 'FINISHED', name='lesson_status')


def upgrade() -> None:
    lesson_id_seq = sa.Sequence("lessons_lesson_id_seq")

    op.execute(sa.schema.CreateSequence(lesson_id_seq))

    op.create_table(
        "lessons",
        sa.Column("lesson_id", sa.Integer(), lesson_id_seq, primary_key=True, server_default=lesson_id_seq.next_value()),
        sa.Column("tutor_id", sa.Integer(), sa.ForeignKey("tutors.tutor_id"), nullable=False),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.student_id"), nullable=False),
        sa.Column("theme_id", sa.Integer(), sa.ForeignKey("themes.theme_id"), nullable=False),
        sa.Column("date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("note", sa.String(), server_default=sa.text("'Заметок нет'")),
        sa.Column("status", LessonStatus, nullable=False, server_default=sa.text("'CREATED'")),
        sa.Column("start_date", sa.DateTime(timezone=True)),
        sa.Column("is_paid", sa.Boolean(), nullable=False, default=False)
    )

    if app_type == 'development':
        upgrade_development()


def downgrade() -> None:
    op.drop_table("lessons")

    op.execute(sa.schema.DropSequence(sa.Sequence("lessons_lesson_id_seq")))

    op.execute("DROP TYPE IF EXISTS lesson_status")


def upgrade_development() -> None:
    connection = op.get_bind()
    # Создание тестового урока
    lesson_date = datetime.utcnow()
    connection.execute(
        sa.text(
            """INSERT INTO "lessons" (tutor_id, student_id, theme_id, date, note, status, is_paid)
               VALUES (:tutor_id, :student_id, :theme_id, :date, 'Урок не завершен', 'CREATED', False)"""
        ),
        dict(tutor_id=TEST_TUTOR_ID, student_id=TEST_STUDENT_ID, theme_id=TEST_THEME_ID, date=lesson_date)
    )
