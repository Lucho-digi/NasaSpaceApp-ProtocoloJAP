const API_BASE_URL = typeof API_CONFIG !== 'undefined' ? API_CONFIG.BASE_URL : 'http://localhost:8000/api';

const WeatherAPI = {
    async fetchWeatherData(latitude, longitude, date = null, startTime = null, endTime = null) {
        try {
            let url = `${API_BASE_URL}/weather?latitude=${latitude}&longitude=${longitude}`;
            
            if (date) url += `&date=${date}`;
            if (startTime) url += `&start_time=${startTime}`;
            if (endTime) url += `&end_time=${endTime}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    },

    async fetchWeeklyForecast(latitude, longitude) {
        try {
            const url = `${API_BASE_URL}/forecast/weekly?latitude=${latitude}&longitude=${longitude}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching weekly forecast:', error);
            return null;
        }
    }
};

const WeatherUtils = {
    getWeatherIcon(condition, rainProbability, cloudCoverage, timeOfDay = 'day') {
        const prefix = timeOfDay === 'day' ? 'day' : 'night';
        
        if (rainProbability > 0.7) return `wi-${prefix}-rain`;
        if (rainProbability > 0.4) return `wi-${prefix}-showers`;
        if (cloudCoverage > 80) return 'wi-cloudy';
        if (cloudCoverage > 50) return `wi-${prefix}-cloudy`;
        if (cloudCoverage > 20) return `wi-${prefix}-sunny-overcast`;
        
        return `wi-${prefix}-sunny`;
    },

    getConditionText(rainProbability, cloudCoverage) {
        if (rainProbability > 0.7) return 'Rainy';
        if (rainProbability > 0.4) return 'Showers';
        if (cloudCoverage > 80) return 'Cloudy';
        if (cloudCoverage > 50) return 'Partly Cloudy';
        if (cloudCoverage > 20) return 'Mostly Sunny';
        return 'Sunny';
    },

    formatTemperature(celsius) {
        return Math.round(celsius);
    },

    formatWindSpeed(metersPerSecond) {
        return Math.round(metersPerSecond * 3.6);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    },

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    resolve({ latitude: -34.6037, longitude: -58.3816 });
                }
            );
        });
    },

    getStoredLocation() {
        const stored = localStorage.getItem('userLocation');
        if (stored) {
            return JSON.parse(stored);
        }
        return { latitude: -34.6037, longitude: -58.3816, place_name: 'Buenos Aires, Argentina' };
    },

    setStoredLocation(location) {
        localStorage.setItem('userLocation', JSON.stringify(location));
    }
};
