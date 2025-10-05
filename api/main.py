from fastapi import FastAPI
from routes import forecast, health

app = FastAPI(
    title="RainCheck API",
    version="0.1.0",
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
