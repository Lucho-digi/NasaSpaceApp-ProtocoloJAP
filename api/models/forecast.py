from pydantic import BaseModel

class Location(BaseModel):
    latitude: float
    longitude: float

class ForecastRequest(BaseModel):
    latitude: float
    longitude: float
    date: str  # YYYY-MM-DD

class ForecastResponse(BaseModel):
    location: Location
    date: str
    temperature: float          # °C
    humidity: float             # %
    precipitation: float        # mm/h
    wind_speed: float           # km/h
    rain_probability: float     # %
