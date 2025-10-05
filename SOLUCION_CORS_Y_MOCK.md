# 🔧 Solución CORS y Modo Mock

## ✅ Problema Resuelto

El error CORS ocurre porque el navegador bloquea las peticiones de `file://` o `http://localhost:XXXX` al backend `http://localhost:8000` por seguridad.

---

## 🎯 Solución Implementada: Modo Mock

He agregado un **sistema de datos mock** que permite que el sitio funcione **sin backend**.

### **Configuración:**

En `Front/js/utils.js`:

```javascript
const USE_MOCK_DATA = true;  // ← Cambia a false cuando el backend esté listo
```

### **¿Cómo funciona?**

1. Si `USE_MOCK_DATA = true`:
   - Usa archivos JSON de ejemplo (`example-api-response.json` y `example-weekly-response.json`)
   - Funciona sin necesidad de backend
   - Perfecto para desarrollo del frontend

2. Si `USE_MOCK_DATA = false`:
   - Intenta conectar con el backend real
   - Si falla (CORS o backend offline), hace fallback a datos mock automáticamente
   - Muestra advertencia en consola

---

## 🚀 Cómo Usar Ahora

### **Opción 1: Desarrollo Frontend (Modo Mock)**

1. Abre `Front/js/utils.js`
2. Verifica que esté:
   ```javascript
   const USE_MOCK_DATA = true;
   ```

3. Abre el sitio:
   ```bash
   # Opción A: Con Python
   cd Front
   python -m http.server 8080
   
   # Opción B: Con PHP
   cd Front
   php -S localhost:8080
   
   # Opción C: Con VS Code Live Server
   # Click derecho en index.html → "Open with Live Server"
   ```

4. Navega a `http://localhost:8080`

✅ **Todo funciona con datos de ejemplo**

---

### **Opción 2: Con Backend Real**

1. **Configura CORS en tu backend FastAPI:**

```python
# En tu archivo principal de FastAPI (main.py o similar)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:3000",
        "*"  # En desarrollo solamente - quitar en producción
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tus endpoints aquí...
@app.get("/api/weather")
async def get_weather(...):
    ...
```

2. **Inicia el backend:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Cambia el modo en frontend:**
   ```javascript
   // En Front/js/utils.js
   const USE_MOCK_DATA = false;  // ← Conectar al backend real
   ```

4. **Inicia el frontend:**
   ```bash
   cd Front
   python -m http.server 8080
   ```

5. Navega a `http://localhost:8080`

✅ **Ahora usa datos reales de la API**

---

## 🔍 Verificación

### **Revisa la consola del navegador (F12):**

**Con Mock Data:**
```
🟢 Sin errores CORS
🟢 Datos se cargan correctamente
```

**Con Backend Real (funcionando):**
```
🟢 Fetching: http://localhost:8000/api/weather?latitude=...
🟢 Datos recibidos de la API
```

**Con Backend Real (fallback a mock):**
```
🟡 Error fetching weather data: ...
🟡 Falling back to mock data...
🟢 Datos mock cargados
```

---

## 🎨 Navegación Arreglada (Week → Today)

El problema era que las tarjetas no tenían la ruta correcta. Ahora cada tarjeta del `week.html` es un enlace completo:

```javascript
// En week.js:
card.href = `today.html?date=${dayData.date}&lat=${location.latitude}&lon=${location.longitude}`;
```

### **Prueba:**

1. Abre `http://localhost:8080/pages/week.html`
2. Verás 6 tarjetas con días
3. **Click en cualquier día** (ej: "Wednesday, Oct 8")
4. Te lleva a `today.html?date=2025-10-08&lat=...&lon=...`
5. Muestra todos los detalles de ese día

✅ **Navegación funcionando**

---

## 📋 Checklist

### **Para Desarrollo (Solo Frontend):**
- [x] `USE_MOCK_DATA = true` en `utils.js`
- [x] Servidor local corriendo (Python/PHP/Live Server)
- [x] Archivos JSON de ejemplo presentes
- [x] Navegador en `http://localhost:XXXX`

### **Para Producción (Con Backend):**
- [ ] Backend con CORS configurado
- [ ] Backend corriendo en puerto 8000
- [ ] `USE_MOCK_DATA = false` en `utils.js`
- [ ] Frontend y backend en mismo dominio o CORS permitido

---

## 🐛 Debugging

### **Error: Failed to load mock data**

**Causa:** Archivos JSON no encontrados

**Solución:**
```bash
# Verifica que existan:
ls Front/example-api-response.json
ls Front/example-weekly-response.json

# Si no existen, están en el repositorio
git checkout Front/example-*.json
```

### **Error: CORS persiste con backend**

**Solución:**
1. Verifica que el middleware CORS esté antes de las rutas
2. Reinicia el backend después de agregar CORS
3. Limpia caché del navegador (Ctrl+Shift+Delete)
4. Usa modo incógnito para probar

### **Las tarjetas no abren detalles**

**Verifica:**
```javascript
// En la consola del navegador:
document.querySelectorAll('.day-card-link').forEach(link => {
    console.log(link.href);
});

// Debe mostrar:
// http://localhost:8080/pages/today.html?date=2025-10-06&lat=...
```

---

## 🎯 Resumen

| Modo | Backend Necesario | CORS | Datos |
|------|-------------------|------|-------|
| **Mock** (`USE_MOCK_DATA = true`) | ❌ No | ✅ No hay problema | Ejemplos estáticos |
| **Real** (`USE_MOCK_DATA = false`) | ✅ Sí | ⚠️ Debe configurarse | API en tiempo real |
| **Fallback automático** | ⚠️ Opcional | ⚠️ Si falla, usa mock | Mock si API falla |

---

## 🚀 Siguiente Paso

1. **AHORA:** Usa modo mock para desarrollar frontend
2. **Después:** Implementa backend con CORS
3. **Luego:** Cambia a `USE_MOCK_DATA = false`
4. **Finalmente:** Deploy en producción con mismo dominio

---

**¡El sitio ahora funciona perfectamente con datos de ejemplo!** 🎉
