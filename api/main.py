from fastapi import FastAPI
from routes import forecast, health
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="RainCheck API",
    version="0.1.0",
)


origins = [
    "https://rain-check.earth",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
