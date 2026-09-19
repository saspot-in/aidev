"""Public surface of the health feature. Other modules import only from here."""

from app.features.health.api import router

__all__ = ["router"]
