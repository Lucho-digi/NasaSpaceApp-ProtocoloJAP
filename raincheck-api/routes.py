from fastapi import APIRouter
from models import ForecastRequest, ForecastResponse


router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/forecast", response_model=ForecastResponse)
def forecast(request: ForecastRequest):
    """
    Endpoint that returns the probability of rain for the given date and location.
    Currently uses mock logic.
    """
    from services.forecast import get_mock_forecast
    return get_mock_forecast(request)
