import asyncio
from sqlalchemy import text
from api.db.base import engine
from api.utils.config import settings

async def test_connection():
    try:
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT version();"))
            version = result.scalar()
            print("✅ Conexión exitosa a la base de datos")
            print(f"Database version: {version}")
    except Exception as e:
        print(f"❌ Error al conectar con la base de datos: {e}")
        raise
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_connection())
