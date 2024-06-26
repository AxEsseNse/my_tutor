__all__ = ["TutorNotFoundError", "TutorAlreadyExistError", "TutorSaveImageError", "TutorAlreadyHasLesson"]


class TutorNotFoundError(Exception):
    message = "Такой преподаватель не зарегистрирован в системе"


class TutorAlreadyExistError(Exception):
    message = "Данный пользователь уже имеет профиль преподавателя"


class TutorSaveImageError(Exception):
    message = "Ошибка сохранения изображения"


class TutorAlreadyHasLesson(Exception):
    message = "У преподавателя уже есть урок в заданное время"
