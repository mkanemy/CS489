import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .db.database import create_db_and_tables
from .routers import vault, auth, health

# Load environment variables
load_dotenv(override=True)

IS_DOCS_ENABLED: bool = (os.getenv("DEPLOYMENT") or "").capitalize() != "PRODUCTION"
APP_TITLE: str = "LockedIn"


# App Configuration
@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title=APP_TITLE, lifespan=lifespan, docs_url="/docs" if IS_DOCS_ENABLED else None, redoc_url=None)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("FASTAPI_SECRET_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://lockedin.quest",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

app.include_router(vault.router)
app.include_router(auth.router)
app.include_router(health.router)
