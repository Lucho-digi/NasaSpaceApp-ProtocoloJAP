import requests
import pandas as pd
from datetime import datetime

def fetch_power_data(lat, lon, start_date, end_date, parameters, community="AG", units="metric"):
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    params = {
        "start": start_date,
        "end": end_date,
        "latitude": lat,
        "longitude": lon,
        "community": community.lower(),
        "parameters": ",".join(parameters),
        "format": "JSON",
        "units": units
    }
    
    response = requests.get(base_url, params=params)
    if response.status_code != 200:
        raise Exception(f"Error {response.status_code}: {response.text}")
    
    data = response.json()
    
    df_dict = {"time": []}
    for param in parameters:
        df_dict[param] = []

    try:
        times = sorted(data["properties"]["parameter"][parameters[0]].keys())
    except KeyError:
        raise Exception("Parámetros no disponibles para la fecha o ubicación seleccionada.")
    
    for t in times:
        df_dict["time"].append(datetime.strptime(t, "%Y%m%d"))
        for param in parameters:
            value = data["properties"]["parameter"][param][t]
            df_dict[param].append(pd.NA if value == -999 else value)
    
    df = pd.DataFrame(df_dict)
    return df
