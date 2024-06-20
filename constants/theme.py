from enum import Enum


class ThemeAccess(Enum):
    AVAILABLE = 1
    NOT_AUTHORIZED = 2
    ERROR = 3
