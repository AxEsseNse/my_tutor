"""create demos and studying progress tables

Revision ID: ecdc34f97ee5
Revises: 75128f99037f
Create Date: 2024-06-21 09:29:35.982481

"""
from os import getenv
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = 'ecdc34f97ee5'
down_revision: Union[str, None] = '75128f99037f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

app_type = getenv('APPTYPE', 'development')
DemoExamStatus = sa.Enum('CREATED', 'STARTED', 'CANCELED', 'FINISHED', name='demo_exam_status')


def upgrade() -> None:
    demo_exam_id_seq = sa.Sequence("demo_exams_demo_exam_id_seq")
    demo_exam_task_id_seq = sa.Sequence("demo_exams_demo_exam_task_id_seq")
    demo_exam_progress_id_seq = sa.Sequence("demo_exam_progress_demo_exam_progress_id_seq")

    op.execute(sa.schema.CreateSequence(demo_exam_id_seq))
    op.execute(sa.schema.CreateSequence(demo_exam_task_id_seq))
    op.execute(sa.schema.CreateSequence(demo_exam_progress_id_seq))

    op.create_table(
        "demo_exams",
        sa.Column("demo_exam_id", sa.Integer(), demo_exam_id_seq, primary_key=True, server_default=demo_exam_id_seq.next_value()),
        sa.Column("exam_id", sa.Integer(), sa.ForeignKey("exams.exam_id"), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("descr", sa.String(), nullable=False),
        sa.Column("material", JSONB(), server_default="{}"),
        sa.Column("answers", JSONB(), server_default="{}")
    )
    op.create_table(
        "demo_exam_progress",
        sa.Column("demo_exam_progress_id", sa.Integer(), demo_exam_progress_id_seq, primary_key=True,
                  server_default=demo_exam_progress_id_seq.next_value()),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.student_id"), nullable=False),
        sa.Column("demo_id", sa.Integer(), sa.ForeignKey("demo_exams.demo_exam_id"), nullable=False),
        sa.Column("status", DemoExamStatus, nullable=False, server_default=sa.text("'CREATED'")),
        sa.Column("start_date", sa.DateTime(timezone=True)),
        sa.Column("student_answers", JSONB(), server_default="{}"),
        sa.Column("points", JSONB(), server_default="{}"),
        sa.Column("result", sa.Integer(), nullable=False)
    )

    connection = op.get_bind()
    if app_type == 'development':
        upgrade_development(connection)
    else:
        upgrade_product(connection)


def downgrade() -> None:
    op.drop_table("demo_exam_progress")
    op.drop_table("demo_exams")

    op.execute(sa.schema.DropSequence(sa.Sequence("demo_exam_progress_demo_exam_progress_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("demo_exams_demo_exam_task_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("demo_exams_demo_exam_id_seq")))

    op.execute("DROP TYPE IF EXISTS demo_exam_status")


def upgrade_product(connection) -> None:
    pass


def upgrade_development(connection) -> None:
    pass
