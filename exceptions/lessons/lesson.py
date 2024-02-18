__all__ = ["LessonAlreadyExistError", "LessonNotFoundError"]


class LessonAlreadyExistError(Exception):
    message = "Урок с заданными параметрами уже существует"


class LessonNotFoundError(Exception):
    message = "Урока с заданными параметрами в системе не найдено"
