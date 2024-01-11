from fastapi import Request
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="templates")


async def main_page(request: Request):
    return templates.TemplateResponse("main_page.html", {"request": request, "title": "Мой репетитор"})

async def admin_board(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request, "title": "Панель администрирования"})

async def login(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request
        },
    )
