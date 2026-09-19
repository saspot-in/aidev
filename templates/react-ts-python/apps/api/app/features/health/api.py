from fastapi import APIRouter

from app.features.health.model import HealthResponse

router = APIRouter(prefix="/api")


@router.get("/health", response_model=HealthResponse, operation_id="getHealth")
def get_health() -> HealthResponse:
    return HealthResponse(status="ok")
