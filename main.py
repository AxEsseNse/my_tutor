from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from my_tutor.api import login
from my_tutor.app_pages import main_page, login, admin_board
from my_tutor.routers import api_router, admin_router

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_api_route(path="/", endpoint=main_page)
app.add_api_route(path="/login", endpoint=login)
app.add_api_route(path="/admin", endpoint=admin_board)

api_router.include_router(admin_router)
app.include_router(api_router)
