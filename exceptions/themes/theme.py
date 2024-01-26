__all__ = ["ThemeNotFoundError", "ThemeAlreadyExistError"]


class ThemeNotFoundError(Exception):
    message = "Тема с таким названием не найдена"


class ThemeAlreadyExistError(Exception):
    message = "Тема с данным названием уже существует"
