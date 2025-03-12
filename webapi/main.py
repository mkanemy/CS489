import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from .db.database import create_db_and_tables
from .routers import vault, auth

# Load environment variables
load_dotenv(override=True)

# App Configuration
@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="LockedIn", lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("FASTAPI_SECRET_KEY"))

app.include_router(vault.router)
app.include_router(auth.router)


