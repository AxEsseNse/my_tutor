"""create studying table

Revision ID: 57e58c030de9
Revises: fbe7c84805fd
Create Date: 2024-02-29 01:22:09.247386

"""
import json
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from zoneinfo import ZoneInfo


# revision identifiers, used by Alembic.
revision: str = '57e58c030de9'
down_revision: Union[str, None] = 'fbe7c84805fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

moscow_tz = ZoneInfo('Europe/Moscow')
TEST_STUDENT_ID = 1
TEST_NOT_STUDIED_THEME_ID = 2
TEST_COMPLETED_THEME_ID = 3
TEST_IN_PROGRESS_THEME_ID = 4
TEST_DATE = datetime.now(moscow_tz)


def upgrade() -> None:
    theme_status_id_seq = sa.Sequence("themes_statuses_theme_status_id_seq")
    studying_id_seq = sa.Sequence("studying_studying_id_seq")

    op.execute(sa.schema.CreateSequence(theme_status_id_seq))
    op.execute(sa.schema.CreateSequence(studying_id_seq))

    op.create_table(
        "themes_statuses",
        sa.Column("theme_status_id", sa.Integer(), theme_status_id_seq, primary_key=True, server_default=theme_status_id_seq.next_value()),
        sa.Column("title", sa.String(length=11), nullable=False)
    )
    op.create_table(
        "studying",
        sa.Column("studying_id", sa.Integer(), studying_id_seq, primary_key=True,
                  server_default=studying_id_seq.next_value()),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.student_id"), nullable=False),
        sa.Column("theme_id", sa.Integer(), sa.ForeignKey("themes.theme_id"), nullable=False),
        sa.Column("date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("theme_status_id", sa.Integer(), sa.ForeignKey("themes_statuses.theme_status_id"), nullable=False),
        sa.Column("progress_cards", JSONB(), server_default="{}")
    )

    connection = op.get_bind()
    #  Добавление для тем статуса "Не изучалась" и записи для тестового студента по неизученной теме
    connection.execute(
        sa.text(
            """INSERT INTO "themes_statuses" (title) VALUES ('PLANNED')"""
        )
    )
    theme_status_not_studied_id = connection.execute(sa.text("SELECT currval('themes_statuses_theme_status_id_seq')")).fetchone()[0]
    connection.execute(
        sa.text(
            """INSERT INTO "studying" (student_id, theme_id, date, theme_status_id)
               VALUES (:student_id, :theme_id, :date, :theme_status_id)"""
        ),
        dict(student_id=TEST_STUDENT_ID, theme_id=TEST_NOT_STUDIED_THEME_ID, date=TEST_DATE, theme_status_id=theme_status_not_studied_id)
    )

    #  Добавление для тем статуса "Изучена" и записи для тестового студента по изученной теме
    connection.execute(
        sa.text(
            """INSERT INTO "themes_statuses" (title) VALUES ('COMPLETED')"""
        )
    )
    theme_status_completed_id = connection.execute(sa.text("SELECT currval('themes_statuses_theme_status_id_seq')")).fetchone()[0]
    completed_theme_progress_cards = {
        7: "CABD",
        8: "DABC"
    }
    completed_theme_progress_cards_json = json.dumps(completed_theme_progress_cards)
    connection.execute(
        sa.text(
            """INSERT INTO "studying" (student_id, theme_id, date, theme_status_id, progress_cards)
               VALUES (:student_id, :theme_id, :date, :theme_status_id, :progress_cards)"""
        ),
        dict(student_id=TEST_STUDENT_ID, theme_id=TEST_COMPLETED_THEME_ID, date=TEST_DATE, theme_status_id=theme_status_completed_id, progress_cards=completed_theme_progress_cards_json)
    )

    #  Добавление для тем статуса "Изучается" и записи для тестового студента по изучаемой теме
    connection.execute(
        sa.text(
            """INSERT INTO "themes_statuses" (title) VALUES ('IN PROGRESS')"""
        )
    )
    theme_status_in_progress_id = connection.execute(sa.text("SELECT currval('themes_statuses_theme_status_id_seq')")).fetchone()[0]
    in_progress_theme_progress_cards = {
        10: "3"
    }
    in_progress_theme_progress_cards_json = json.dumps(in_progress_theme_progress_cards)
    connection.execute(
        sa.text(
            """INSERT INTO "studying" (student_id, theme_id, date, theme_status_id, progress_cards)
               VALUES (:student_id, :theme_id, :date, :theme_status_id, :progress_cards)"""
        ),
        dict(student_id=TEST_STUDENT_ID, theme_id=TEST_IN_PROGRESS_THEME_ID, date=TEST_DATE,
             theme_status_id=theme_status_in_progress_id, progress_cards=in_progress_theme_progress_cards_json)
    )


def downgrade() -> None:
    op.drop_table("studying")
    op.drop_table("themes_statuses")

    op.execute(sa.schema.DropSequence(sa.Sequence("themes_statuses_theme_status_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("studying_studying_id_seq")))
