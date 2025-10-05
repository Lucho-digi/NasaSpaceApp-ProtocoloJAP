# Rain Check ☔

**NASA Space Apps Challenge 2025 - Will It Rain on My Parade?**

🌐 **[Visit Rain Check](https://example.com)** *(Demo site)*

## 🌍 Overview

Rain Check is a weather prediction application that helps users determine the probability of specific weather conditions occurring at any location and date worldwide. Built for the NASA Space Apps Challenge 2025, this project addresses the challenge of predicting weather patterns to help people plan their outdoor activities with confidence.

### Challenge Description

[Will It Rain on My Parade?](https://www.spaceappschallenge.org/2025/challenges/will-it-rain-on-my-parade/?tab=details)

Whether planning a parade, outdoor wedding, sporting event, or any outdoor activity, knowing the weather forecast is crucial. Rain Check leverages NASA's Earth observation data to provide accurate weather predictions and probability assessments.

## 🚀 Features

- **Location-based Weather Predictions**: Enter any location worldwide to get weather forecasts
- **Date Selection**: Check weather probabilities for specific future dates
- **Probability Analysis**: View the likelihood of different weather conditions (rain, sun, clouds, etc.)
- **Interactive Weather Display**: 
  - Today's detailed weather information
  - 6-day forecast with comprehensive details
  - Temperature trends and patterns

## 🛠️ Technology Stack

### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **JavaScript**: Interactive features and API integration
- **Leaflet.js**: Interactive map for location selection

### Backend
- **FastAPI** (Python 3.12+): High-performance API framework
- **Pydantic**: Data validation and settings management
- **HTTPx**: Async HTTP client for API requests
- **Xarray**: Multi-dimensional arrays for weather data processing
- **PyDAP**: Data Access Protocol client for NASA datasets
- **Uvicorn**: ASGI server for production deployment

### Database
- **PostgreSQL**: Robust relational database for storing:
  - Historical weather data cache
  - User preferences and locations
  - Prediction results and analytics

### Hosting & Deployment
- **Microsoft Azure**: Cloud hosting platform
  - Azure App Service for web hosting
  - Azure Database for PostgreSQL
  - Scalable and reliable infrastructure

### Data Sources
- **[NASA POWER API](https://power.larc.nasa.gov/docs/services/api/)**: 
  - Provides historical and forecasted meteorological data
  - Global coverage with high-resolution data
  - Temperature, precipitation, wind, and humidity data
  
- **[NASA GES DISC OPeNDAP and GDS](https://disc.gsfc.nasa.gov/information/tools?title=OPeNDAP%20and%20GDS)**:
  - Access to NASA's Earth science data
  - Advanced weather pattern analysis
  - Satellite-derived meteorological information

## 📋 How It Works

1. **User Input**: Users select a location (via map or text input) and specify a date
2. **API Request**: Frontend sends request to FastAPI backend
3. **Data Retrieval**: Backend queries NASA's POWER API and GES DISC datasets using PyDAP
4. **Data Processing**: 
   - Historical climate data is retrieved and processed with Xarray
   - Short-term forecasts are analyzed
   - Data is cached in PostgreSQL for faster subsequent queries
5. **Probability Calculation**: 
   - Machine learning algorithms analyze patterns
   - Historical trends are compared with current forecasts
   - Rain probability is calculated based on multiple data points
6. **Result Display**: Users receive:
   - Probability percentages for different weather conditions
   - Temperature forecasts (high/low)
   - Wind speed and humidity levels
   - Weather recommendations for their planned activity

## 🎯 Project Structure

```
Rain_Check/
├── Front/                  # Frontend Application
│   ├── index.html          # Landing page
│   ├── pages/
│   │   ├── today.html      # Current weather details
│   │   ├── week.html       # 6-day forecast
│   │   └── about.html      # Project information
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   ├── variables.css   # CSS variables (themes)
│   │   ├── responsive.css  # Responsive breakpoints
│   │   └── reset.css       # CSS reset
│   └── js/
│       ├── main.js         # Main JavaScript logic
│       ├── map.js          # Map integration
│       └── utils.js        # Utility functions
├── Back/                   # Backend API (FastAPI)
│   ├── raincheck-api/
│   │   ├── main.py         # FastAPI application entry
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   ├── database/       # PostgreSQL integration
│   │   └── utils/          # Helper functions
│   └── pyproject.toml      # Python dependencies
└── README.md
```

## 📦 Backend Dependencies

```toml
[project]
name = "raincheck-api"
version = "0.1.0"
description = "FastAPI service to forecast rain probability using short-term forecasts and historical climate data."
requires-python = ">=3.12"
dependencies = [
    "dotenv>=0.9.9",         # Environment variable management
    "fastapi>=0.118.0",      # Modern web framework
    "httpx>=0.28.1",         # Async HTTP client
    "pydantic>=2.11.9",      # Data validation
    "pydap>=3.5.8",          # NASA data access protocol
    "uvicorn>=0.37.0",       # ASGI server
    "xarray>=2025.9.1",      # Weather data processing
]
```

## 🌐 NASA Data Integration

### POWER API
The Prediction Of Worldwide Energy Resources (POWER) project provides:
- Solar and meteorological data
- 40+ years of historical data
- Global coverage at 0.5° x 0.5° resolution
- Real-time and forecasted weather parameters

### GES DISC OPeNDAP
NASA's Goddard Earth Sciences Data and Information Services Center provides:
- Satellite-based precipitation estimates
- Advanced atmospheric data
- High-resolution weather patterns
- Climate analysis tools

## 💡 Use Cases

- **Event Planning**: Determine the best date for outdoor events
- **Agriculture**: Plan planting and harvesting activities
- **Travel**: Choose optimal travel dates based on weather
- **Sports**: Schedule outdoor sporting events with confidence
- **Photography**: Find ideal weather conditions for outdoor shoots

## 🎨 Design Features

- **Modern UI/UX**: Clean, intuitive interface
- **Weather Cards**: Comprehensive daily weather information including:
  - Weather condition icons
  - High/Low temperatures
  - Precipitation probability
  - Wind speed

## 🚧 Development Status

- 🔄 Frontend interface (static/hardcoded)
- 🔄 Responsive design implemented
- 🔄 Weather visualization (mock data)
- 🔄 Backend API structure in development
- 🔄 PostgreSQL database schema design
- 🔄 FastAPI endpoints implementation
- 🔄 NASA data pipeline development
- 📋 Probability calculation algorithm
- 📋 Dynamic data integration
- 🔄 Azure deployment configuration
- 📋 Frontend-Backend integration

**Current State**: The application currently displays hardcoded weather data for demonstration purposes. Integration with NASA APIs and dynamic data fetching is in active development.

## 🚀 Getting Started

### Prerequisites
- Python 3.12 or higher
- [uv](https://docs.astral.sh/uv/) package manager
- PostgreSQL database

### Backend Setup
```bash
cd Back/raincheck-api
uv sync
uv run uvicorn main:app --reload
```

### Frontend Setup
Simply open `Front/index.html` in a modern web browser or serve via a local server:
```bash
cd Front
python -m http.server 8000
```

### Environment Variables
Create a `.env` file in the backend directory:
```
DATABASE_URL=postgresql://user:password@localhost/raincheck
NASA_POWER_API_KEY=your_api_key_here
```

## 👥 Team - Protocolo JAP

Built with passion for the NASA Space Apps Challenge 2025

## 📄 License

This project was created for the NASA Space Apps Challenge 2025

---

**Note**: This application uses NASA's open data to provide weather predictions. Always consult official weather services for critical decision-making.
