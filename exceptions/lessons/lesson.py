__all__ = ["LessonAlreadyExistError", "LessonNotFoundError", "LessonFinishError", "LessonAlreadyStarted", "LessonAlreadyFinished", "LessonNotStarted"]


class LessonAlreadyExistError(Exception):
    message = "Урок с заданными параметрами уже существует"


class LessonNotFoundError(Exception):
    message = "Урока с заданными параметрами в системе не найдено"


class LessonFinishError(Exception):
    message = "Урок не может автоматически завершиться"


class LessonAlreadyStarted(Exception):
    message = "Тему или ученика можно изменить только у НЕНАЧАТЫХ занятий"


class LessonAlreadyFinished(Exception):
    message = "Урок завершен преподавателем"


class LessonNotStarted(Exception):
    message = "Урок не начат"
