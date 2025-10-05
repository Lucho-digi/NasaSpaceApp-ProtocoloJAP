from pydantic import BaseModel

class ForecastRequest(BaseModel):
    latitude: float
    longitude: float
    date: str  # YYYY-MM-DD

class Location(BaseModel):
    latitude: float
    longitude: float

class ForecastResponse(BaseModel):
    location: Location
    date: str
    temperature: float
    precipitation: float
    humidity: float
    wind_speed: float
    solar_radiation: float
