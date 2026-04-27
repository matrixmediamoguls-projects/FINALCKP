from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
def get_user():
    return {
        "id": 1,
        "username": "admin",
        "role": "seeker"
    }