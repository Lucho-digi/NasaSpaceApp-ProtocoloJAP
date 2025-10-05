# 🚀 Quick Start - Frontend Dinámico

## ✅ Todo está listo!

El frontend ahora es **100% dinámico** y consume tu API.

---

## 🔧 Configuración Rápida

### 1. Configura la URL de tu API

Edita `Front/js/config.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',  // ← Cambia esto
    ...
};
```

### 2. Asegúrate que tu backend tenga estos endpoints:

- `GET /api/weather?latitude={lat}&longitude={lon}`
- `GET /api/forecast/weekly?latitude={lat}&longitude={lon}`

### 3. Habilita CORS en tu backend

Para FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica dominios
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 Testing

### Opción 1: Página de Prueba
Abre `Front/test-api.html` en tu navegador para probar los endpoints.

### Opción 2: Directamente
1. Abre `Front/index.html`
2. Abre la consola del navegador (F12)
3. Verás logs de las llamadas a la API

---

## 📁 Archivos de Referencia

- `example-api-response.json` - Formato esperado para `/weather`
- `example-weekly-response.json` - Formato esperado para `/forecast/weekly`
- `API_MAPPING.md` - Cómo se mapean los datos a la UI
- `README.md` - Documentación completa

---

## 🎯 Formato de Respuesta Requerido

Tu API debe devolver JSONs con esta estructura:

```json
{
  "location": {
    "latitude": -34.9011,
    "longitude": -56.1645,
    "place_name": "Montevideo, Uruguay"
  },
  "date": "2025-10-05",
  "atmospheric_conditions": {
    "precipitation": {
      "probability": 0.78,
      "intensity_mm_hr": 1.4
    },
    "temperature": {
      "surface_celsius": 20.3,
      "min_celsius": 18.0,
      "max_celsius": 23.7
    },
    "humidity": {
      "relative_percent": 82
    },
    "wind": {
      "speed_m_s": 6.4
    },
    "clouds": {
      "coverage_percent": 88
    }
  },
  "forecast_summary": "Alta probabilidad de lluvia..."
}
```

---

## ✨ Características Implementadas

✅ Carga dinámica de datos desde API
✅ Persistencia de ubicación en localStorage
✅ Selección inteligente de íconos meteorológicos
✅ Reverse geocoding en el mapa
✅ Conversión automática de unidades
✅ Recomendaciones de actividades
✅ Responsive en todos los dispositivos

---

## 🐛 Solución de Problemas

### No se cargan los datos
1. Verifica que el backend esté corriendo
2. Revisa la URL en `config.js`
3. Confirma que CORS esté habilitado
4. Abre la consola del navegador para ver errores

### Los íconos no cambian
- Verifica que `precipitation.probability` y `clouds.coverage_percent` estén en el JSON

### Las temperaturas están raras
- Asegúrate de enviar temperaturas en Celsius (no Kelvin)

---

## 📞 Flujo Completo

```
Usuario abre página
    ↓
JS obtiene ubicación de localStorage
    ↓
Llama a /api/weather con coordenadas
    ↓
Recibe JSON
    ↓
Procesa y formatea datos
    ↓
Actualiza UI dinámicamente
```

---

## 🎉 Siguientes Pasos

1. Implementa los endpoints en tu backend
2. Prueba con `test-api.html`
3. Verifica que las 3 páginas funcionen
4. ¡Listo para producción!

---

## 📚 Documentación Completa

Lee `RESUMEN_FRONTEND_DINAMICO.md` para detalles completos.

---

**¡Todo configurado! Solo falta conectar el backend!** 🚀
