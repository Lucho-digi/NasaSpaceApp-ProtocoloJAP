const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    USE_MOCK_DATA: true,  // Set to false when backend is ready with CORS enabled
    ENDPOINTS: {
        WEATHER: '/weather',
        WEEKLY_FORECAST: '/forecast/weekly'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
