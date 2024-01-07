from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from my_tutor.app_pages import main_page, login


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_api_route(path="/", endpoint=main_page)
app.add_api_route(path="/login", endpoint=login)
