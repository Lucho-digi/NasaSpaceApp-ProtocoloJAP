from datetime import datetime
from api.services.indices import test_simulation_3days
from api.services.nasa_power import fetch_power_data


def get_forecast(latitude: float, longitude: float, date: str):
    """
    Función principal que devuelve el forecast para una ubicación y fecha.
    Combina datos de NASA POWER y simulaciones de índices climáticos.
    """
    # Parsear fecha
    target_date = datetime.strptime(date, "%Y-%m-%d")

    # Obtener datos de NASA POWER
    power_vars = [
        "T2M",  # temperature_2m
        "PRECTOT",  # precipitation
        "RH2M",  # relative humidity
        "ALLSKY_SFC_SW_DWN",  # solar radiation
        "WS10M",  # wind speed 10m
    ]
    power_data = fetch_power_data(latitude, longitude, date, date, power_vars)

    # Simulación probabilística de precipitación y clima usando Monte Carlo
    indices_results = test_simulation_3days(N=1000)

    # Ejemplo de forecast summary (puedes mejorarlo luego)
    forecast_summary = "Alta probabilidad de lluvia ligera y nubosidad densa."

    # Construir JSON final
    result = {
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "place_name": "Ubicación simulada",
            "grid_resolution_deg": 0.5,
        },
        "date": date,
        "data_sources": {
            "power_api": power_data,
            "ges_disc_opendap": {
                "description": "Datos de OPENDAP aún no integrados",
                "variables": ["precipitation_rate", "cloud_top_temperature"],
            },
        },
        "forecast_summary": forecast_summary,
        "model_output": {
            "rain_forecast_index": indices_results.get("B", (0, 0))[0],  # ejemplo
            "confidence_score": 0.9,
            "model_version": "montecarlo-v1",
        },
    }
    return result
