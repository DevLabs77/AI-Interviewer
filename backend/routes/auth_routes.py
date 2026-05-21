from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Register Model
class RegisterUser(BaseModel):
    name: str
    email: str
    password: str

# Login Model
class LoginUser(BaseModel):
    email: str
    password: str


# Test Route
@router.get("/test")
def test_route():
    return {"message": "Auth route working"}


# Register Route
@router.post("/register")
def register(user: RegisterUser):
    return {
        "message": "User registered successfully",
        "user": user
    }


# Login Route
@router.post("/login")
def login(user: LoginUser):
    return {
        "message": "Login successful",
        "user": user
    }