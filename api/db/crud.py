from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.db.models import ForecastRecord
from api.models.forecast import ForecastResponse

async def create_forecast(db: AsyncSession, forecast: ForecastResponse):
    record = ForecastRecord(
        date=forecast.date,
        location=forecast.location,
        probability=forecast.probability,
        will_rain=str(forecast.will_rain).lower(),
        source=forecast.source,
        details=forecast.details,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record

async def get_forecasts(db: AsyncSession, limit: int = 10):
    result = await db.execute(select(ForecastRecord).limit(limit))
    return result.scalars().all()
