"""add student, parent table

Revision ID: 68a720858db9
Revises: 2ccfc8173544
Create Date: 2024-01-17 02:13:06.402886

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '68a720858db9'
down_revision: Union[str, None] = '2ccfc8173544'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "students",
        sa.Column("student_id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("first_name", sa.String(length=15), nullable=False),
        sa.Column("second_name", sa.String(length=25), nullable=False),
        sa.Column("gender", sa.String()),
        sa.Column("lesson_price", sa.Integer()),
        sa.Column("img_path", sa.String()),
        sa.Column("birthday", sa.DateTime(), nullable=False),
        sa.Column("discord", sa.String(length=25), nullable=False),
        sa.Column("phone", sa.String(length=11), unique=True),
        sa.Column("telegram", sa.String(length=11), unique=True),
        sa.Column("whatsapp", sa.String(length=11), unique=True)
    )
    op.create_table(
        "parents",
        sa.Column("parent_id", sa.Integer(), primary_key=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(length=6), nullable=False),
        sa.Column("first_name", sa.String(length=15), nullable=False),
        sa.Column("second_name", sa.String(length=25)),
        sa.Column("phone", sa.String(length=11), unique=True),
        sa.Column("telegram", sa.String(length=11), unique=True),
        sa.Column("whatsapp", sa.String(length=11), unique=True),
        sa.Column("node", sa.String())
    )

    connection = op.get_bind()
    kira_birthday = datetime.utcnow()
    connection.execute(
        sa.text(
            """INSERT INTO "students" values (1, 2, 'Кира', 'Фазмафобовна', 'девушка', 1200, '/storage/users/female_default_image.jpg',:date, 'ya_discord', '88008000808', '88008000808', '88008000808')"""
        ), dict(date=kira_birthday)
    )
    connection.execute(
        sa.text(
            """INSERT INTO "parents" values (1, 1, 'Отец', 'Сергей', 'Николаевич', 78005553535, 78005553535, 78005553535, 'Батяныч Киры')"""
        )
    )


def downgrade() -> None:
    op.drop_table("parents")
    op.drop_table("students")
