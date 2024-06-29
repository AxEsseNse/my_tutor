__all__ = ["DemoExamNotFoundError", "DemoExamAlreadyExistError", "DemoExamTaskAlreadyExistError", "DemoExamTaskNotFoundError"]


class DemoExamNotFoundError(Exception):
    message = "Демоверсия не найдена"


class DemoExamAlreadyExistError(Exception):
    message = "Демоверсия с данным названием и описанием уже существует"


class DemoExamTaskAlreadyExistError(Exception):
    def __init__(self, task_number):
        self.message = f"В данной демоверсии уже существует задание № {task_number}"


class DemoExamTaskNotFoundError(Exception):
    def __init__(self, task_number):
        self.message = f"В данной демоверсии отсутствует задание № {task_number}"



# class SaveFileError(Exception):
#     message = "Ошибка сохранения файла на сервере"
#
#
# class DeleteFileError(Exception):
#     message = "Ошибка удаления файла из хранилища"
#
#
# class ThemeProgressFoundError(Exception):
#     message = "Данная тема не изучалась учеником"
