from fastapi import APIRouter, HTTPException
from app.schemas.auth import LoginRequest
from app.services.auth_service import authenticate_user

router = APIRouter()

@router.post("/login")
def login(data: LoginRequest):
    user = authenticate_user(data.username, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "token": "fake-jwt-token",  # replace later
        "user": user
    }