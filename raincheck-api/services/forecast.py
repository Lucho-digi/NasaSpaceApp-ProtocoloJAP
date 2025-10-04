from models import ForecastRequest, ForecastResponse

def get_mock_forecast(request: ForecastRequest) -> ForecastResponse:
    """
    Mock prediction logic:
    - Even days → rains with 70% probability
    - Odd days → does not rain with 20% probability
    """
    will_rain = request.date.day % 2 == 0
    probability = 0.7 if will_rain else 0.2
    location = request.city if request.city else f"({request.lat}, {request.lon})"

    return ForecastResponse(
        date=request.date,
        location=location,
        will_rain=will_rain,
        probability=probability,
        source="mock-data",
        details={
            "rule": "days even -> rain, days odd -> no rain"
        }
    )
