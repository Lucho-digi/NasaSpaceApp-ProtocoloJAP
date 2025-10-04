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
