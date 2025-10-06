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
  - 7-day forecast with comprehensive details
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
- **Uvicorn**: ASGI server for production deployment

### Hosting & Deployment
- **Microsoft Azure**: Cloud hosting platform
  - Azure App Service for web hosting
  - Azure Database for PostgreSQL
  - Scalable and reliable infrastructure
- **Vercel**: Web Hosting service

### Data Sources
- **[NASA POWER API](https://power.larc.nasa.gov/docs/services/api/)**: 
  - Provides historical and forecasted meteorological data
  - Global coverage with high-resolution data
  - Temperature, precipitation, wind, and humidity datan

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


## 🌐 NASA Data Integration

### POWER API
The Prediction Of Worldwide Energy Resources (POWER) project provides:
- Solar and meteorological data
- 40+ years of historical data
- Global coverage at 0.5° x 0.5° resolution
- Real-time and forecasted weather parameters

## 💡 Use Cases

- **Event Planning**: Determine the best date for outdoor events
- **Agriculture**: Plan planting and harvesting activities
- **Travel**: Choose optimal travel dates based on weather
- **Sports**: Schedule outdoor sporting events with confidence
- **Photography**: Find ideal weather conditions for outdoor shoots

## 👥 Team - Protocolo JAP

Built with passion for the NASA Space Apps Challenge 2025

## 📄 License

This project was created for the NASA Space Apps Challenge 2025

---

**Note**: This application uses NASA's open data to provide weather predictions. Always consult official weather services for critical decision-making.
