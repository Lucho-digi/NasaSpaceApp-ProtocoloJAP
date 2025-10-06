document.addEventListener('DOMContentLoaded', async () => {
    async function initializeUserLocation() {
        try {
            const position = await WeatherUtils.getCurrentLocation();
            const placeName = await WeatherAPI.getPlaceNameFromCoords(position.latitude, position.longitude);
            
            WeatherUtils.setStoredLocation({
                latitude: position.latitude,
                longitude: position.longitude,
                place_name: placeName,
                timestamp: Date.now()
            });
        } catch (error) {
            WeatherUtils.setStoredLocation({
                latitude: -34.75,
                longitude: -56.04,
                place_name: 'Canelones, Uruguay',
                timestamp: Date.now()
            });
        }
    }

    async function loadTodayWeather() {
        await initializeUserLocation();
        
        const location = WeatherUtils.getStoredLocation();
        const weatherData = await WeatherAPI.fetchWeatherData(location.latitude, location.longitude);

        if (!weatherData) {
            document.getElementById('location-name').textContent = 'Error cargando datos';
            return;
        }

        updateTodayPage(weatherData, location);
    }

    function updateTodayPage(weatherData, location) {
        const temp = weatherData.atmospheric_conditions.temperature;
        const precip = weatherData.atmospheric_conditions.precipitation;
        const clouds = weatherData.atmospheric_conditions.clouds;
        const wind = weatherData.atmospheric_conditions.wind;
        const humidity = weatherData.atmospheric_conditions.humidity;
        const solar = weatherData.atmospheric_conditions.solar;
        const pressure = weatherData.atmospheric_conditions.pressure;

        const locationElement = document.getElementById('location-name');
        if (locationElement) {
            const displayName = weatherData.location.place_name || location.place_name;
            locationElement.textContent = displayName;
            
            if (weatherData.location.place_name && weatherData.location.place_name !== location.place_name) {
                location.place_name = weatherData.location.place_name;
                WeatherUtils.setStoredLocation(location);
            }
        }

        const tempElement = document.querySelector('.today-temp');
        if (tempElement) {
            tempElement.textContent = WeatherUtils.formatTemperature(temp.surface_celsius) + '°C';
        }

        const condition = WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent);
        const conditionElement = document.querySelector('.today-condition');
        if (conditionElement) {
            conditionElement.textContent = condition;
        }

        const icon = WeatherUtils.getWeatherIcon(condition, precip.probability, clouds.coverage_percent, 'day');
        const iconElement = document.querySelector('.today-weather-status i');
        if (iconElement) {
            iconElement.className = 'wi ' + icon;
        }
        updateElement('temp-current', WeatherUtils.formatTemperature(temp.surface_celsius) + '°C');
        updateElement('temp-feels', WeatherUtils.formatTemperature(temp.dew_point_celsius) + '°C');
        updateElement('temp-range', WeatherUtils.formatTemperature(temp.max_celsius) + '°C / ' + WeatherUtils.formatTemperature(temp.min_celsius) + '°C');
        updateElement('humidity', Math.round(humidity.relative_percent) + '%');
        updateElement('wind-speed', WeatherUtils.formatWindSpeed(wind.speed_m_s) + ' km/h');
        updateElement('pressure', pressure.surface_hpa.toFixed(1) + ' hPa');
        updateElement('precip-prob', Math.round(precip.probability * 100) + '%');
        updateElement('cloud-coverage', Math.round(clouds.coverage_percent) + '%');
        
        if (solar.sunrise) {
            updateElement('sunrise', formatTime(solar.sunrise));
        }
        if (solar.sunset) {
            updateElement('sunset', formatTime(solar.sunset));
        }

        if (weatherData.forecast_summary) {
            updateElement('forecast-summary', weatherData.forecast_summary);
        }

        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        updateElement('date-display', dateStr);
    }

    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }



    function formatTime(isoString) {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    await loadTodayWeather();
});