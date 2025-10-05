# Rain Check - Front-end

Un sitio web moderno y responsive construido con HTML, CSS y JavaScript puro (sin dependencias).

## 📁 Estructura del Proyecto

```
Front/
├── index.html              # Página principal
├── css/
│   ├── reset.css          # CSS Reset
│   ├── variables.css      # Variables CSS (colores, espaciado, etc.)
│   ├── style.css          # Estilos principales
│   └── responsive.css     # Estilos responsive
├── js/
│   ├── utils.js           # Funciones utilitarias
│   └── main.js            # JavaScript principal
├── images/                # Imágenes
├── icons/                 # Iconos
├── fonts/                 # Fuentes personalizadas
└── README.md
```

## 🚀 Uso

### Desarrollo Local

1. Simplemente abre `index.html` en tu navegador
2. O usa un servidor local:

**Python:**
```bash
cd Front
python -m http.server 8000
```

**PHP:**
```bash
cd Front
php -S localhost:8000
```

**VS Code Live Server:**
- Instala la extensión "Live Server"
- Click derecho en `index.html` → "Open with Live Server"

## ✨ Características

- ✅ **100% Vanilla JavaScript** - Sin frameworks ni librerías
- ✅ **CSS Modular** - Organizado en archivos separados
- ✅ **Responsive Design** - Funciona en todos los dispositivos
- ✅ **Smooth Scrolling** - Navegación suave
- ✅ **Mobile Menu** - Menú hamburguesa para móviles
- ✅ **Form Validation** - Validación de formulario de contacto
- ✅ **Scroll Animations** - Animaciones al hacer scroll
- ✅ **CSS Variables** - Fácil personalización de colores y estilos

## 🎨 Personalización

### Colores
Edita las variables en `css/variables.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --dark-color: #2c3e50;
    /* ... más variables */
}
```

### Contenido
Edita el contenido en `index.html`

### Estilos
- Estilos generales: `css/style.css`
- Responsive: `css/responsive.css`
- Variables: `css/variables.css`

### JavaScript
- Funciones principales: `js/main.js`
- Utilidades: `js/utils.js`

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Dispositivos móviles

## 📝 Notas

- No requiere compilación
- No requiere Node.js
- No requiere npm/yarn
- Solo HTML, CSS y JavaScript puro

## 🔧 Funcionalidades JavaScript Incluidas

- Menú móvil responsive
- Smooth scrolling
- Validación de formularios
- Animaciones al scroll
- Navegación activa según scroll
- Sistema de notificaciones (toast)
- Utilidades (debounce, throttle, localStorage, etc.)

## 📄 Licencia

MIT

---

## 🔌 Dynamic API Integration

The frontend is now fully dynamic and consumes weather data from the backend API.

### API Configuration

Edit `js/config.js` to change the API base URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    ENDPOINTS: {
        WEATHER: '/weather',
        WEEKLY_FORECAST: '/forecast/weekly'
    }
};
```

### Expected API Endpoints

#### 1. Current Weather Data
**GET** `/api/weather`

Query Parameters:
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `date` (optional): Date in YYYY-MM-DD format
- `start_time` (optional): Start time in ISO 8601 format
- `end_time` (optional): End time in ISO 8601 format

#### 2. Weekly Forecast
**GET** `/api/forecast/weekly`

Query Parameters:
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate

Response: Array of 6-7 weather objects with same structure as current weather endpoint.

### Key Dynamic Features

1. **Auto Location Storage** - User's selected location persists via localStorage
2. **Interactive Map** - Click to select location with reverse geocoding
3. **Smart Weather Icons** - Automatically selected based on conditions
4. **Activity Recommendations** - Dynamic suggestions based on weather data
5. **Real-time Updates** - All data fetched from API on page load

### Updated File Structure

```
Front/
├── js/
│   ├── config.js          # API configuration (NEW)
│   ├── utils.js           # API calls and utilities (UPDATED)
│   ├── main.js            # Main app logic (UPDATED)
│   ├── today.js           # Today page logic (NEW)
│   ├── week.js            # Week page logic (NEW)
│   └── map.js             # Map integration (UPDATED)
```

### How It Works

1. Page loads → Fetch location from localStorage
2. Call API with coordinates
3. Parse JSON response
4. Update UI dynamically
5. User clicks map → Update location → Refresh data

### Weather Icon Logic

Icons are selected based on:
- Rain probability: >70% = rain, >40% = showers
- Cloud coverage: >80% = cloudy, >50% = partly cloudy
- Time of day: day/night variants

See `WeatherUtils.getWeatherIcon()` in `utils.js` for full logic.
