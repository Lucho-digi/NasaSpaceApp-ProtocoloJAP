from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from api.models.forecast import ForecastResponse, ForecastRequest, Location
from api.services.nasa_power import fetch_power_data
from api.services.indices import (
    calculate_trend_and_predict,
    filter_window,
    split_periods,
    calculate_means,
)

router = APIRouter()


@router.post("/", response_model=ForecastResponse)
def forecast(request: ForecastRequest):
    try:
        target_date = datetime.strptime(request.date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Formato de fecha inválido, usar YYYY-MM-DD"
        )

    # 🔹 Usamos la función de nasa_power.py
    start_year = datetime.today().year - 6
    end_year = datetime.today().year - 1
    df_hist = fetch_power_data(
        request.latitude,
        request.longitude,
        f"{start_year}0101",
        f"{end_year}1231",
        ["T2M", "PRECTOTCORR", "RH2M", "ALLSKY_SFC_SW_DWN", "WS10M"],
    )

    # 🔹 Filtrar ventana ±5 días alrededor del día objetivo
    df_window = filter_window(df_hist, target_date)

    # 🔹 Dividir en periodos y calcular medias
    first_half, last_half = split_periods(df_window)
    mean_old = calculate_means(first_half)
    mean_new = calculate_means(last_half)

    # 🔹 Tendencia y predicción
    _, prediction = calculate_trend_and_predict(mean_old, mean_new)

    # 🔹 Formatear JSON
    forecast_json = ForecastResponse(
    location=Location(latitude=request.latitude, longitude=request.longitude),
    date=request.date,
    temperature=prediction["T2M"],
    precipitation=prediction["PRECTOTCORR"],
    humidity=prediction["RH2M"],
    wind_speed=prediction["WS10M"],
    solar_radiation=prediction["ALLSKY_SFC_SW_DWN"],
)
    return forecast_json