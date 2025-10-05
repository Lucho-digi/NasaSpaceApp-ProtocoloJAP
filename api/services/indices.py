import pandas as pd
from datetime import datetime

def filter_window(df: pd.DataFrame, target_date: pd.Timestamp | datetime, window_days: int = 5) -> pd.DataFrame:
    day_of_year = pd.Timestamp(target_date).timetuple().tm_yday
    df = df.copy()
    df["day_of_year"] = df["time"].dt.dayofyear
    filtered = df[(df["day_of_year"] >= day_of_year - window_days) & 
                  (df["day_of_year"] <= day_of_year + window_days)]
    return filtered

def split_periods(df: pd.DataFrame):
    years = sorted(df["time"].dt.year.unique())
    if len(years) < 6:
        raise ValueError("Se necesitan al menos 6 años de datos")
    first_half = df[df["time"].dt.year.isin(years[:3])]
    last_half = df[df["time"].dt.year.isin(years[3:])]
    return first_half, last_half

def calculate_means(df: pd.DataFrame):
    cols = ["T2M", "PRECTOTCORR", "RH2M", "WS10M"]
    return {col: df[col].mean() for col in cols}

def calculate_trend_and_predict(mean_old: dict, mean_new: dict):
    trend = {k: mean_new[k] - mean_old[k] for k in mean_old.keys()}
    prediction = {k: mean_new[k] + trend[k]/3 for k in mean_old.keys()}  # proyección a 1 año
    return trend, prediction

def calculate_rain_probability(df: pd.DataFrame) -> float:
    """
    Probabilidad de lluvia basada en la proporción de días con precip > 1mm.
    """
    if df.empty:
        return 0.0
    rainy_days = (df["PRECTOTCORR"] > 1).sum()
    total_days = len(df)
    return round(100 * rainy_days / total_days, 1)
