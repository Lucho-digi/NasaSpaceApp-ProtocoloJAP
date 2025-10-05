from sqlalchemy import Column, Integer, Float, Date, JSON, DateTime, func
from api.db.base import Base


class ClimateCache(Base):
    __tablename__ = "climate_cache"
    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    date_requested = Column(Date, nullable=False)
    result = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())