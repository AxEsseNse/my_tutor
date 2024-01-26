"""create exams and themes tables

Revision ID: f73374f24848
Revises: 68a720858db9
Create Date: 2024-01-26 06:07:58.900818

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f73374f24848'
down_revision: Union[str, None] = '68a720858db9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "exams",
        sa.Column("exam_id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=3), nullable=False)
    )
    op.create_table(
        "themes",
        sa.Column("theme_id", sa.Integer(), primary_key=True),
        sa.Column("exam_id", sa.Integer(), sa.ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(), unique=True, nullable=False),
        sa.Column("descr", sa.String(), nullable=False),
        sa.Column("material", sa.JSON(), default={})
    )

    connection = op.get_bind()
    connection.execute(
        sa.text(
            """INSERT INTO "exams" values (1, 'ЕГЭ'), (2, 'ОГЭ')"""
        )
    )


def downgrade() -> None:
    op.drop_table("themes")
    op.drop_table("exams")
