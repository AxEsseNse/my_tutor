__all__ = ["ThemeNotFoundError", "ThemeAlreadyExistError", "ThemeCardNotFoundError", "SaveFileError", "DeleteFileError", "ThemeProgressFoundError"]


class ThemeNotFoundError(Exception):
    message = "Тема не найдена"


class ThemeAlreadyExistError(Exception):
    message = "Тема с данным названием уже существует"


class ThemeCardNotFoundError(Exception):
    message = "В данной теме отсутствует карточка под таким номером"


class SaveFileError(Exception):
    message = "Ошибка сохранения файла на сервере"


class DeleteFileError(Exception):
    message = "Ошибка удаления файла из хранилища"


class ThemeProgressFoundError(Exception):
    message = "Данная тема не изучалась учеником"
