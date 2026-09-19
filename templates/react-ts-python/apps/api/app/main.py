from fastapi import FastAPI

from app.features.health import router as health_router

app = FastAPI(title="__PROJECT_NAME__")
app.include_router(health_router)
