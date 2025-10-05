from fastapi import APIRouter, Query, HTTPException
from datetime import datetime
from api.services.forecast import get_forecast

router = APIRouter()


@router.get("/forecast")
async def forecast(
    latitude: float = Query(..., description="Latitud del lugar"),
    longitude: float = Query(..., description="Longitud del lugar"),
    date: str = Query(..., description="Fecha en formato YYYY-MM-DD"),
):
    """
    Endpoint que devuelve el forecast para una ubicación y fecha dada.
    """
    # Validar formato de fecha
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Fecha inválida. Debe ser YYYY-MM-DD"
        )

    # Obtener el forecast
    result = get_forecast(latitude, longitude, date)

    return result
