from api.db.base import Base, engine
from api.db import models

def create_tables():
    """
    Crea todas las tablas definidas en los modelos SQLAlchemy.
    """
    print("🔧 Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas correctamente.")

if __name__ == "__main__":
    create_tables()
