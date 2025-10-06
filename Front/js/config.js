const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    USE_MOCK_DATA: false,
    
    // Open-Meteo API Configuration (no API key needed)
    OPEN_METEO: {
        BASE_URL: 'https://api.open-meteo.com/v1',
        GEOCODING_URL: 'https://geocoding-api.open-meteo.com/v1',
        // Current weather parameters
        CURRENT_PARAMS: [
            'temperature_2m',
            'relative_humidity_2m', 
            'apparent_temperature',
            'precipitation',
            'weather_code',
            'cloud_cover',
            'pressure_msl',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m',
            'wind_gusts_10m'
        ],
        // Daily forecast parameters  
        DAILY_PARAMS: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'apparent_temperature_max',
            'apparent_temperature_min',
            'precipitation_sum',
            'precipitation_probability_max',
            'wind_speed_10m_max',
            'wind_gusts_10m_max',
            'wind_direction_10m_dominant',
            'sunrise',
            'sunset'
        ],
        TIMEZONE: 'auto'
    },
    
    ENDPOINTS: {
        WEATHER: '/weather',
        WEEKLY_FORECAST: '/forecast/weekly'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
