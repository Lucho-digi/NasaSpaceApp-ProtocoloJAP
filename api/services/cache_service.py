from sqlalchemy.orm import Session
from datetime import date
from api.db.models import ForecastCache

def get_cached_result(db: Session, lat: float, lon: float, forecast_date: date):
    """
    Devuelve un resultado cacheado si existe.
    """
    return (
        db.query(ForecastCache)
        .filter(
            ForecastCache.latitude == lat,
            ForecastCache.longitude == lon,
            ForecastCache.date == forecast_date,
        )
        .first()
    )

def save_cache(db: Session, lat: float, lon: float, forecast_date: date, result: dict):
    """
    Guarda un nuevo resultado de forecast en la base de datos.
    Si ya existe, lo actualiza.
    """
    existing = get_cached_result(db, lat, lon, forecast_date)
    if existing:
        existing.result = result
    else:
        new_entry = ForecastCache(
            latitude=lat,
            longitude=lon,
            date=forecast_date,
            result=result,
        )
        db.add(new_entry)
    db.commit()
