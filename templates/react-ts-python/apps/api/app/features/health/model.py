from typing import Literal

from app.shared.schemas import CamelModel


class HealthResponse(CamelModel):
    status: Literal["ok"]
