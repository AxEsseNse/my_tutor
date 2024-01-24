from fastapi import Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse

from my_tutor.depends import get_authorized_user

templates = Jinja2Templates(directory="templates")
LOGIN_URL = "/login"


async def login(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is not None:
        print('XUY???', authorized_user)
        return RedirectResponse("/")
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request,
            "title": "Авторизация"
        }
    )


async def main_page(request: Request, authorized_user=Depends(get_authorized_user)):
    # if authorized_user is None:
    #     return RedirectResponse(LOGIN_URL)
    return templates.TemplateResponse(
        "main_page.html",
        {
            "request": request,
            "title": "Мой репетитор",
            "user": authorized_user
        }
    )


async def admin_board(request: Request, authorized_user=Depends(get_authorized_user)):
    return templates.TemplateResponse(
        "admin_users.html",
        {
            "request": request,
            "title": "Панель администрирования",
            "user": authorized_user
        }
    )

async def student_profile(request: Request, authorized_user=Depends(get_authorized_user)):
    return templates.TemplateResponse(
        "student_profile.html",
        {
            "request": request,
            "title": "Профиль",
            "user": authorized_user
        }
    )