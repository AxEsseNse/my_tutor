__all__ = ["StudentNotFoundError", "StudentSaveImageError", "StudentAlreadyExistError"]


class StudentNotFoundError(Exception):
    message = "Такой студент не зарегистрирован в системе"


class StudentSaveImageError(Exception):
    message = "Ошибка сохранения изображения"


class StudentAlreadyExistError(Exception):
    message = "Данный пользователь уже имеет профиль студента"


class StudentAlreadyHasLesson(Exception):
    message = "У студента уже есть урок в заданное время"
