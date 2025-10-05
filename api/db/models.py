from sqlalchemy import Column, Integer, String, Float, Date, Boolean, JSON
from api.db.base import Base

class ForecastRecord(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    location = Column(String, nullable=False)
    probability = Column(Float)
    will_rain = Column(Boolean)
    source = Column(String)
    details = Column(JSON)
