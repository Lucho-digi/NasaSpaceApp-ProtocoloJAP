const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    ENDPOINTS: {
        WEATHER: '/weather',
        WEEKLY_FORECAST: '/forecast/weekly'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
