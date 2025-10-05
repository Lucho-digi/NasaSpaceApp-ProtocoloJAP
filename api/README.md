# Raincheck API - NASA Space Apps Challenge 2025

A FastAPI-based service that provides weather forecasts using historical NASA POWER data. The API predicts temperature, humidity, wind speed, precipitation, and rain probability for specific locations and dates by analyzing patterns in historical climate data.

## Overview: How It Works

Raincheck API utilizes NASA POWER (Prediction Of Worldwide Energy Resources) data to generate weather forecasts. The process follows these steps:

1. Fetches 6 years of historical data for the requested location
2. Filters data to a ±5 day window around the target date
3. Analyzes trends by comparing first and last 3 years of data
4. Projects future values based on observed trends
5. Calculates rain probability from historical patterns

### Data Sources
- **NASA POWER API**: Provides daily climate data including:
  - Temperature at 2 meters (T2M)
  - Precipitation (PRECTOTCORR)
  - Relative Humidity at 2 meters (RH2M)
  - Wind Speed at 10 meters (WS10M)

## API Usage

### Base URL
```
http://localhost:8000
```

### Forecast Endpoint

**POST** `/forecast`

Request body:
```json
{
    "latitude": 34.0522,
    "longitude": -118.2437,
    "date": "2025-10-15"
}
```

Response:
```json
{
    "location": {
        "latitude": 34.0522,
        "longitude": -118.2437
    },
    "date": "2025-10-15",
    "temperature": 23.5,
    "humidity": 65.2,
    "precipitation": 0.12,
    "wind_speed": 8.4,
    "rain_probability": 30.0
}
```

## Available Endpoints

| Endpoint | Method | Description |
|----------|---------|------------|
| `/forecast` | POST | Generate weather forecast for specific location and date |
| `/health` | GET | Check API health status |

### Health Check
**GET** `/health`

Response:
```json
{
    "status": "ok"
}
```

## Forecast Logic

The forecast generation process involves several steps:

1. **Historical Data Analysis**
   - Retrieves 6 years of historical data
   - Creates a window of ±5 days around target date
   - Splits data into two 3-year periods for trend analysis

2. **Trend Calculation**
   - Compares averages between first and last 3-year periods
   - Projects future values based on observed trends
   - Adjusts predictions using recent patterns

3. **Rain Probability**
   - Calculated as percentage of days with precipitation > 1mm
   - Uses historical data within the date window
   - Provides probability based on local patterns

## Data Fields Explanation

| Field | Unit | Description |
|-------|------|-------------|
| temperature | °C | Average temperature at 2 meters above ground |
| humidity | % | Relative humidity at 2 meters above ground |
| precipitation | mm/h | Hourly precipitation rate |
| wind_speed | km/h | Wind speed at 10 meters above ground |
| rain_probability | % | Probability of precipitation >1mm on given date |


## Project Structure

```
api/
├── README.md
├── main.py             # FastAPI application setup
├── models
│   └── forecast.py     # Data models and schemas
├── pyproject.toml
├── routes
│   ├── forecast.py     # Forecast endpoint handlers
│   └── health.py       # Health check endpoint
├── services
│   ├── indices.py      # Statistical calculations
│   ├── nasa_opendap.py # Extra source for more precise calculations (UNUSED)
│   └── nasa_power.py   # NASA POWER API integration
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Run the development server:
   ```bash
   uv run uvicorn main:app --reload
   ```

## Support

For issues, feature requests, or questions, please open an issue on GitHub: [Raincheck Repository](https://github.com/Lucho-digi/Rain_Check)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Created for NASA Space Apps Challenge 2025