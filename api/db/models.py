from sqlalchemy import Column, Integer, Float, Date, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ForecastCache(Base):
    __tablename__ = "forecast_cache"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    result = Column(JSON, nullable=False)
