"""create exams and themes tables

Revision ID: f73374f24848
Revises: 68a720858db9
Create Date: 2024-01-26 06:07:58.900818

"""
from os import getenv
import json
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = 'f73374f24848'
down_revision: Union[str, None] = '68a720858db9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

app_type = getenv('APPTYPE', 'development')


def upgrade() -> None:
    exam_id_seq = sa.Sequence("exams_exam_id_seq")
    theme_id_seq = sa.Sequence("themes_theme_id_seq")
    theme_card_id_seq = sa.Sequence("themes_card_id_seq")

    op.execute(sa.schema.CreateSequence(exam_id_seq))
    op.execute(sa.schema.CreateSequence(theme_id_seq))
    op.execute(sa.schema.CreateSequence(theme_card_id_seq))

    op.create_table(
        "exams",
        sa.Column("exam_id", sa.Integer(), exam_id_seq, primary_key=True, server_default=exam_id_seq.next_value()),
        sa.Column("title", sa.String(length=3), nullable=False)
    )
    op.create_table(
        "themes",
        sa.Column("theme_id", sa.Integer(), theme_id_seq, primary_key=True, server_default=theme_id_seq.next_value()),
        sa.Column("exam_id", sa.Integer(), sa.ForeignKey("exams.exam_id"), nullable=False),
        sa.Column("exam_task_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("descr", sa.String(), nullable=False),
        sa.Column("material", JSONB(), server_default="{}")
    )

    connection = op.get_bind()
    if app_type == 'development':
        upgrade_development(connection)
    else:
        upgrade_product(connection)


def downgrade() -> None:
    op.drop_table("themes")
    op.drop_table("exams")

    op.execute(sa.schema.DropSequence(sa.Sequence("themes_card_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("themes_theme_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("exams_exam_id_seq")))


def upgrade_product(connection) -> None:
    connection.execute(
        sa.text(
            """INSERT INTO "exams" (title) VALUES ('ЕГЭ'), ('ОГЭ')"""
        )
    )


def upgrade_development(connection) -> None:
    # Добавление экзамена "ЕГЭ" и создание первой темы этого экзамена
    connection.execute(
        sa.text(
            """INSERT INTO "exams" (title) VALUES ('ЕГЭ')"""
        )
    )
    ege_exam_id = connection.execute(sa.text("SELECT currval('exams_exam_id_seq')")).fetchone()[0]
    ege_first_theme_theory_material_id = connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[
        0]
    ege_first_theme_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    test_material_ege = [
        {
            "card_id": ege_first_theme_theory_material_id,
            "type": "theory",
            "title": "Вызов исполнителя Черепаха",
            "image_path": "/storage/themes/ege/6/theory1.jpg",
            "descr": "Чтобы команды для работы с черепахой работали - необходимо импортировать сам модуль Черепаха"
        },
        {
            "card_id": ege_first_theme_practice_material_id,
            "type": "practice",
            "title": "Знание синтаксиса исполнителя",
            "image_path": "/storage/themes/ege/6/practice1.jpg",
            "descr": "Введите в поле ниже команду для импорта модуля Черепаха в программу",
            "answer": "исполнитель Черепаха",
            "tip": {"image_path": "/storage/themes/ege/6/practice1tip.jpg",
                    "descr": "Если на экзамене вдруг забыл как импортировать модуль - зайди в справочный центр"
                    }
        }
    ]
    test_material_ege_json = json.dumps(test_material_ege)
    connection.execute(
        sa.text(
            """INSERT INTO "themes" (exam_id, exam_task_number, title, descr, material)
               VALUES (:exam_id, 6, 'Исполнитель Черепаха', 'Работа в среде КУМИР.', :material)"""
        ),
        dict(exam_id=ege_exam_id, material=test_material_ege_json)
    )

    #  Добавление экзамена "ОГЭ" и создание трех тем этого экзамена
    connection.execute(
        sa.text(
            """INSERT INTO "exams" (title) VALUES ('ОГЭ')"""
        )
    )
    oge_exam_id = connection.execute(sa.text("SELECT currval('exams_exam_id_seq')")).fetchone()[0]

    #  Создание первой темы
    oge_first_theme_theory_material_id = connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[
        0]
    oge_first_theme_first_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    oge_first_theme_second_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    test_material_oge_first_theme = [
        {
            "card_id": oge_first_theme_theory_material_id,
            "type": "theory",
            "title": "Матрица. Симметричная и несимметричная. Понятие главной диагонали",
            "image_path": "/storage/themes/oge/4/theory1.jpg",
            "descr": "Матрицы бывают двух видов. Симметричные и несимметричные."
        },
        {
            "card_id": oge_first_theme_first_practice_material_id,
            "type": "practice",
            "title": "Определение симметричности матрицы",
            "image_path": "/storage/themes/oge/4/practice1.jpg",
            "descr": "Введите в поле ниже какая на картинке представлена матрица",
            "answer": "несимметричная",
            "tip": {"image_path": "/storage/themes/oge/4/practice1tip.jpg",
                    "descr": "Сравнивай значения, находящиеся напротив друг друга относительно главной диагонали"
                    }
        },
        {
            "card_id": oge_first_theme_second_practice_material_id,
            "type": "practice",
            "title": "Нахождение протяженности пути",
            "image_path": "/storage/themes/oge/4/practice2.jpg",
            "descr": "Введите в поле ниже протяженность самого короткого пути из пункта B в H",
            "answer": "14",
            "tip": {"image_path": "/storage/themes/oge/4/practice2tip.jpg",
                    "descr": "Задача решена методом построения дерева"
                    }
        }
    ]
    test_material_oge_first_theme_json = json.dumps(test_material_oge_first_theme)
    connection.execute(
        sa.text(
            """INSERT INTO "themes" (exam_id, exam_task_number, title, descr, material)
               VALUES (:exam_id, 4, 'Поиск путей по таблице', 'Матрица симметричная и не симметричная. Понятие главной диагонали. Графы и Деревья', :material)"""
        ),
        dict(exam_id=oge_exam_id, material=test_material_oge_first_theme_json)
    )

    #  Создание второй темы
    oge_second_theme_theory_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    oge_second_theme_first_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    oge_second_theme_second_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    test_material_oge_second_theme = [
        {
            "card_id": oge_second_theme_theory_material_id,
            "type": "theory",
            "title": "Понятие IP адреса",
            "image_path": "/storage/themes/oge/7/theory1.jpg",
            "descr": "Самое важное свойства IP адреса - его уникальность. Это позволяет избежать как утечки информации, так и спама"
        },
        {
            "card_id": oge_second_theme_first_practice_material_id,
            "type": "practice",
            "title": "Найди корректный IP адрес",
            "image_path": "/storage/themes/oge/7/practice1.jpg",
            "descr": "Введите в поле ниже правильную последовательность символов",
            "answer": "CABD",
            "tip": {"image_path": "/storage/themes/oge/7/practice1tip.jpg",
                    "descr": "Здесь есть подсказка хехе"
                    }
        },
        {
            "card_id": oge_second_theme_second_practice_material_id,
            "type": "practice",
            "title": "Найди корректный IP адрес",
            "image_path": "/storage/themes/oge/7/practice2.jpg",
            "descr": "Введите в поле ниже правильную последовательность символов",
            "answer": "DABC",
            "tip": {"image_path": "/storage/themes/oge/7/practice2tip.jpg",
                    "descr": "Это тоже подсказка хыыы"
                    }
        }
    ]
    test_material_oge_second_theme_json = json.dumps(test_material_oge_second_theme)
    connection.execute(
        sa.text(
            """INSERT INTO "themes" (exam_id, exam_task_number, title, descr, material)
               VALUES (:exam_id, 7, 'IP адрес', 'Правила составления IP адреса', :material)"""
        ),
        dict(exam_id=oge_exam_id, material=test_material_oge_second_theme_json)
    )

    #  Создание третьей темы
    oge_third_theme_theory_material_id = connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[
        0]
    oge_third_theme_first_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    oge_third_theme_second_practice_material_id = \
    connection.execute(sa.text("SELECT nextval('themes_card_id_seq')")).fetchone()[0]
    test_material_oge_third_theme = [
        {
            "card_id": oge_third_theme_theory_material_id,
            "type": "theory",
            "title": "Виды графов",
            "image_path": "/storage/themes/oge/9/theory1.jpg",
            "descr": "Графы бывают двух видов. Ориентированные и нет. На картинке представлены примеры"
        },
        {
            "card_id": oge_third_theme_first_practice_material_id,
            "type": "practice",
            "title": "Нахождение количества путей",
            "image_path": "/storage/themes/oge/9/practice1.jpg",
            "descr": "Найди количество путей из города А в город В",
            "answer": "3",
            "tip": {"image_path": "/storage/themes/oge/9/practice1tip.jpg",
                    "descr": "Снизу изображения есть выбранный правильный ответ"
                    }
        },
        {
            "card_id": oge_third_theme_second_practice_material_id,
            "type": "practice",
            "title": "Нахождение количества путей",
            "image_path": "/storage/themes/oge/9/practice2.jpg",
            "descr": "Найди количество путей из города А в город К",
            "answer": "8",
            "tip": {"image_path": "/storage/themes/oge/9/practice2tip.jpg",
                    "descr": "Пример решается как через построение дерева, так и коротким способом через граф"
                    }
        }
    ]
    test_material_oge_third_theme_json = json.dumps(test_material_oge_third_theme)
    connection.execute(
        sa.text(
            """INSERT INTO "themes" (exam_id, exam_task_number, title, descr, material)
               VALUES (:exam_id, 9, 'Ориентированный граф', 'Нахождение количества путей из одного пункта в другой, имея ориентированный граф.', :material)"""
        ),
        dict(exam_id=oge_exam_id, material=test_material_oge_third_theme_json)
    )
