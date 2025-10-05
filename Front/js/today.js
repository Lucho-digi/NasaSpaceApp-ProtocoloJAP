document.addEventListener('DOMContentLoaded', async () => {
    async function loadTodayWeather() {
        const location = WeatherUtils.getStoredLocation();
        const data = await WeatherAPI.fetchWeatherData(location.latitude, location.longitude);

        if (!data) {
            console.error('Failed to load today weather data');
            return;
        }

        updateTodayPage(data);
    }

    function updateTodayPage(data) {
        const todayCard = document.querySelector('.today-card');
        if (!todayCard) return;

        const location = data.location;
        const temp = data.atmospheric_conditions.temperature;
        const precip = data.atmospheric_conditions.precipitation;
        const clouds = data.atmospheric_conditions.clouds;
        const humidity = data.atmospheric_conditions.humidity;
        const wind = data.atmospheric_conditions.wind;

        todayCard.querySelector('h2').textContent = location.place_name;

        const icon = WeatherUtils.getWeatherIcon(
            WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent),
            precip.probability,
            clouds.coverage_percent,
            'day'
        );
        const condition = WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent);

        todayCard.querySelector('.today-temp').textContent = 
            `${WeatherUtils.formatTemperature(temp.surface_celsius)}°C`;
        todayCard.querySelector('.today-weather-status i').className = `wi ${icon}`;
        todayCard.querySelector('.today-condition').textContent = condition;

        const details = todayCard.querySelectorAll('.detail-item');
        details[0].querySelector('strong').textContent = 
            `${WeatherUtils.formatTemperature(temp.dew_point_celsius)}°C`;
        details[1].querySelector('strong').textContent = 
            `${Math.round(humidity.relative_percent)}%`;
        details[2].querySelector('strong').textContent = 
            `${WeatherUtils.formatWindSpeed(wind.speed_m_s)} km/h`;
        details[3].querySelector('strong').textContent = 
            `${WeatherUtils.formatTemperature(temp.max_celsius)}°C / ${WeatherUtils.formatTemperature(temp.min_celsius)}°C`;
    }

    await loadTodayWeather();
});
