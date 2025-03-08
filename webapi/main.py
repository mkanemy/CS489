import os

from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from .routers import vault, auth

# Load environment variables
load_dotenv(override=True)

# App Configuration
app = FastAPI(title="LockedIn")
app.add_middleware(SessionMiddleware, secret_key=os.getenv("FASTAPI_SECRET_KEY"))

app.include_router(vault.router)
app.include_router(auth.router)
