from fastapi import APIRouter, Request

from webapi.auth import oauth

router = APIRouter()


@router.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get('/auth')
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token['userinfo']

    return user
