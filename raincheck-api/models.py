from pydantic import BaseModel, model_validator
from datetime import date, datetime, timedelta
from typing import Optional, Dict

MAX_YEARS_AHEAD = 1  # Límite máximo para predicciones futuras

# ----------------------------
# Request Schema
# ----------------------------
class ForecastRequest(BaseModel):
    lat: Optional[float] = None
    lon: Optional[float] = None
    city: Optional[str] = None
    date: date

    @model_validator(mode="before")
    def check_location_and_date(cls, values):
        lat = values.get('lat')
        lon = values.get('lon')
        city = values.get('city')
        request_date = values.get('date')

        # Validar ubicación
        if city is None and (lat is None or lon is None):
            raise ValueError("You must provide either a city or lat/lon")

        # Convertir string a date si es necesario
        if isinstance(request_date, str):
            try:
                request_date = datetime.strptime(request_date, "%Y-%m-%d").date()
                values['date'] = request_date  # actualizar el diccionario
            except ValueError:
                raise ValueError("Date must be in YYYY-MM-DD format")

        # Validar fecha
        today = date.today()
        if request_date < today:
            raise ValueError("The date cannot be in the past")
        if request_date > today + timedelta(days=MAX_YEARS_AHEAD*365):
            raise ValueError(f"The date cannot be more than {MAX_YEARS_AHEAD} years in the future")

        return values

# ----------------------------
# Response Schema
# ----------------------------
class ForecastResponse(BaseModel):
    date: date
    location: str            # Ej: "Montevideo, UY" o "(lat, lon)"
    will_rain: bool          # True/False
    probability: float       # 0.0–1.0
    source: str              # "openweather" | "nasa-power" | "mock"
    details: Optional[Dict] = None  # Información extra opcional
