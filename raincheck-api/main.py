from fastapi import FastAPI
from routes import router

app = FastAPI(
    title="RainCheck API",
    description="Dummy version",
    version="0.1.0"
)

app.include_router(router)
