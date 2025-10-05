from sqlalchemy import create_engine, text
from api.utils.config import settings

def test_connection():
    try:
        engine = create_engine(settings.database_url, echo=False, future=True)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.scalar_one()
            print(f"✅ Conexión exitosa a la base de datos. Versión: {version}")
    except Exception as e:
        print(f"❌ Error al conectar con la base de datos: {e}")

if __name__ == "__main__":
    test_connection()
