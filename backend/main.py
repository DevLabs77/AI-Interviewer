from fastapi import FastAPI

# Routes
from routes.auth_routes import router as auth_router
from routes.interview_routes import router as interview_router

app = FastAPI()

# Connect Routers
app.include_router(auth_router)
app.include_router(interview_router)