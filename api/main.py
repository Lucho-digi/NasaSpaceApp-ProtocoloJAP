import os
from fastapi import FastAPI, Header, HTTPException, Depends
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

RAINCHECK_KEY = os.getenv("RAINCHECK_KEY")

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != RAINCHECK_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
