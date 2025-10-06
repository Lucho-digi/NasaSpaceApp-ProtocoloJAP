import os
from fastapi import APIRouter, Depends, HTTPException, Header
from datetime import datetime
from models.forecast import ForecastRequest, ForecastResponse, Location
from services.nasa_power import fetch_power_data
from services.indices import (
    calculate_trend_and_predict,
    filter_window,
    split_periods,
    calculate_means,
    calculate_rain_probability
)

router = APIRouter()

API_KEY = os.getenv("API_KEY", "mi_api_key_secreta")

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.post("/", response_model=ForecastResponse, dependencies=[Depends(verify_api_key)])
def forecast(request: ForecastRequest):
    try:
        target_date = datetime.strptime(request.date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido, usar YYYY-MM-DD")

    # Datos históricos últimos 6 años
    start_year = datetime.today().year - 6
    end_year = datetime.today().year - 1
    df_hist = fetch_power_data(
        request.latitude,
        request.longitude,
        f"{start_year}0101",
        f"{end_year}1231",
        ["T2M","PRECTOTCORR","RH2M","WS10M"]
    )

    # Ventana ±5 días
    df_window = filter_window(df_hist, target_date)

    # Dividir periodos y calcular medias
    first_half, last_half = split_periods(df_window)
    mean_old = calculate_means(first_half)
    mean_new = calculate_means(last_half)

    # Tendencia y predicción
    _, prediction = calculate_trend_and_predict(mean_old, mean_new)

    # Probabilidad de lluvia
    rain_prob = calculate_rain_probability(df_window)

    # Ajustar unidades: PRECIP mm/h (aprox)
    precipitation_mm_per_h = prediction["PRECTOTCORR"] / 24

    # Formatear respuesta
    forecast_json = ForecastResponse(
        location=Location(latitude=request.latitude, longitude=request.longitude),
        date=request.date,
        temperature=round(prediction["T2M"], 1),
        humidity=round(prediction["RH2M"], 1),
        precipitation=round(precipitation_mm_per_h, 2),
        wind_speed=round(prediction["WS10M"], 1),
        rain_probability=rain_prob
    )

    return forecast_json
