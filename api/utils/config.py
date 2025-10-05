from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://fernando:postgres@localhost:5432/raincheck_db"


    model_config = SettingsConfigDict(extra="ignore")

settings = Settings()
