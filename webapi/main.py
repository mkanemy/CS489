import os

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from .routers import vault

SECRET_KEY = os.environ.get('SECRET_KEY') or None
if SECRET_KEY is None:
    raise 'Missing SECRET_KEY'


app = FastAPI()


app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

app.include_router(vault.router)
