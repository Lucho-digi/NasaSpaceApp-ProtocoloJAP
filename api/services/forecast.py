from datetime import datetime, timedelta
from api.services.nasa_power import fetch_power_data
import numpy as np

def test_simulation_3days(n):
    """
    Simulación temporal: genera un conjunto de valores aleatorios
    para simular un pronóstico a 3 días.
    """
    np.random.seed(42)
    simulated = {
        "prob_rain": round(float(np.random.uniform(0, 1)), 2),
        "avg_temp": round(float(np.random.normal(20, 5)), 2),
        "avg_humidity": round(float(np.random.uniform(50, 90)), 2),
        "message": "Simulación de 3 días completada."
    }
    return simulated

def get_forecast(lat: float, lon: float, target_date):
    """
    Lógica principal: obtiene datos de NASA POWER y simula pronóstico.
    """
    start_date = (target_date - timedelta(days=1)).strftime("%Y%m%d")
    end_date = target_date.strftime("%Y%m%d")

    parameters = ["T2M", "RH2M", "PS", "ALLSKY_SFC_SW_DWN", "WS10M"]

    try:
        df = fetch_power_data(lat, lon, start_date, end_date, parameters)
    except Exception as e:
        return {"error": str(e)}

    # Calcular promedios básicos
    avg_temp = df["T2M"].mean()
    avg_humidity = df["RH2M"].mean()
    avg_wind = df["WS10M"].mean()
    solar = df["ALLSKY_SFC_SW_DWN"].mean()

    # Simular probabilidad de lluvia (ejemplo simple)
    prob_rain = max(0, min(1, (avg_humidity / 100) * (1 - solar / 5)))

    return {
        "date": str(target_date),
        "location": f"{lat},{lon}",
        "probability_rain": round(prob_rain * 100, 1),
        "avg_temp": round(avg_temp, 2),
        "avg_humidity": round(avg_humidity, 2),
        "avg_wind": round(avg_wind, 2),
        "solar": round(solar, 2),
        "source": "NASA POWER",
    }
