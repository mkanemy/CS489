import os
from datetime import timedelta

from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse

from webapi.auth.jwt import create_access_token
from webapi.auth.oauth import oauth

IS_SECURE_COOKIES: bool = (os.getenv("DEPLOYMENT") or "").capitalize() == "PRODUCTION"

router = APIRouter()


@router.get("/login", tags=["auth"])
async def login(request: Request):
    request.session.clear()
    frontend_url = os.getenv("FRONTEND_URL")
    redirect_url = os.getenv("REDIRECT_URL")
    request.session["login_redirect"] = frontend_url

    return await oauth.google.authorize_redirect(request, redirect_url, prompt="consent")


@router.get("/auth", tags=["auth"])
@router.post("/auth", tags=["auth"])
async def auth(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    user = token.get("userinfo")
    expires_in = token.get("expires_in")
    iss = user.get("iss")
    user_email = user.get("email")

    if iss not in ["https://accounts.google.com", "accounts.google.com"] or user_email is None:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    # Create JWT token
    access_token_expires = timedelta(seconds=expires_in)
    access_token = create_access_token(data={"email": user_email}, expires_delta=access_token_expires)

    print(access_token)

    redirect_url = request.session.pop("login_redirect", "")
    response = RedirectResponse(redirect_url)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        # secure=IS_SECURE_COOKIES,  # Ensure you're using HTTPS
        samesite="strict",  # Set the SameSite attribute to None
    )

    return response
