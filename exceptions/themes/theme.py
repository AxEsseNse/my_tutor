__all__ = ["ThemeNotFoundError", "ThemeAlreadyExistError", "ThemeCardNotFoundError", "SaveImageError"]


class ThemeNotFoundError(Exception):
    message = "Тема не найдена"


class ThemeAlreadyExistError(Exception):
    message = "Тема с данным названием уже существует"


class ThemeCardNotFoundError(Exception):
    message = "В данной теме отсутствует карточка под таким номером"


class SaveImageError(Exception):
    message = "Ошибка сохранения изображения в файл"
