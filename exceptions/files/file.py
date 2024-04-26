__all__ = ["FileDataNotFoundError", "FileDataAlreadyExistError", "SaveFileError"]


class FileDataNotFoundError(Exception):
    message = "Данных о файле по указанному пути нет в БД"


class FileDataAlreadyExistError(Exception):
    message = "В БД уже есть запись о файле с таким путем"


class SaveFileError(Exception):
    message = "Ошибка сохранения файла на сервере"
