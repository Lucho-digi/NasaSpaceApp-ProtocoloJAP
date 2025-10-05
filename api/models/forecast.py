from pydantic import BaseModel
from typing import Any, Dict


class ForecastResponse(BaseModel):
    date: str
    location: str
    will_rain: bool
    probability: float
    source: str
    details: Dict[str, Any]
