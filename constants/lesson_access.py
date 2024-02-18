from enum import Enum


class LessonAccess(Enum):
    AVAILABLE = 1
    NOT_AUTHORIZED = 2
    NOT_AVAILABLE = 3
    ERROR = 4
