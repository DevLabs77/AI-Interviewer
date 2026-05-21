from fastapi import FastAPI

from routes.auth_routes import router as auth_router
from routes.interview_routes import router as interview_router

app = FastAPI()

# Connect Routes
app.include_router(auth_router)
app.include_router(interview_router)