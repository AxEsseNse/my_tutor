__all__ = ["ThemeNotFoundError", "ThemeAlreadyExistError", "ThemeMaterialNotFoundError"]


class ThemeNotFoundError(Exception):
    message = "Тема не найдена"


class ThemeAlreadyExistError(Exception):
    message = "Тема с данным названием уже существует"


class ThemeMaterialNotFoundError(Exception):
    message = "В данной теме отсутствует карточка под таким номером"
