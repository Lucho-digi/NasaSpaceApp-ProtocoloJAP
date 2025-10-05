import requests
import pandas as pd
from datetime import datetime

def fetch_power_data(lat, lon, start_date, end_date, parameters, community="AG", units="metric"):
    """
    Obtiene datos horarios de la NASA POWER API para un punto específico.
    
    Args:
        lat (float): Latitud.
        lon (float): Longitud.
        start_date (str): Fecha de inicio en formato YYYYMMDD.
        end_date (str): Fecha de fin en formato YYYYMMDD.
        parameters (list[str]): Lista de variables a solicitar.
        community (str): Comunidad (AG, SB, RE).
        units (str): Tipo de unidades ("metric" o "imperial").
    
    Returns:
        pd.DataFrame: DataFrame con columnas: time + parámetros solicitados.
    """
    
    base_url = "https://power.larc.nasa.gov/api/temporal/hourly/point"
    
    # Convertir comunidad a minúsculas según doc
    community = community.lower()
    
    params = {
        "start": start_date,
        "end": end_date,
        "latitude": lat,
        "longitude": lon,
        "community": community,
        "parameters": ",".join(parameters),
        "format": "JSON",
        "units": units
    }
    
    response = requests.get(base_url, params=params)
    
    if response.status_code != 200:
        raise Exception(f"Error {response.status_code}: {response.text}")
    
    data = response.json()
    
    # Verificar si la API devolvió algún mensaje de error
    if "messages" in data and data["messages"]:
        print("Advertencia API:", data["messages"])
    
    # Llenar DataFrame
    df_dict = {"time": []}
    for param in parameters:
        df_dict[param] = []

    try:
        times = sorted(data["properties"]["parameter"][parameters[0]].keys())
    except KeyError:
        raise Exception("Parámetros no disponibles para la fecha o ubicación seleccionada.")
    
    for t in times:
        df_dict["time"].append(datetime.strptime(t, "%Y%m%d%H"))
        for param in parameters:
            value = data["properties"]["parameter"][param][t]
            # Reemplazar fill_value (-999) por NaN
            df_dict[param].append(pd.NA if value == -999 else value)
    
    df = pd.DataFrame(df_dict)
    return df
