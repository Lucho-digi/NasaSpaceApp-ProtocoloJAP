document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    const latParam = urlParams.get('lat');
    const lonParam = urlParams.get('lon');

    async function loadDayWeather() {
        let location = WeatherUtils.getStoredLocation();
        
        if (latParam && lonParam) {
            location = {
                latitude: parseFloat(latParam),
                longitude: parseFloat(lonParam),
                place_name: location.place_name
            };
        }

        const data = await WeatherAPI.fetchWeatherData(
            location.latitude, 
            location.longitude, 
            dateParam
        );

        if (!data) {
            console.error('Failed to load weather data');
            document.getElementById('location-name').textContent = 'Error loading data';
            return;
        }

        updateTodayPage(data, dateParam);
    }

    function updateTodayPage(data, dateOverride) {
        const todayCard = document.querySelector('.today-card');
        if (!todayCard) return;

        const location = data.location;
        const temp = data.atmospheric_conditions.temperature;
        const precip = data.atmospheric_conditions.precipitation;
        const clouds = data.atmospheric_conditions.clouds;
        const humidity = data.atmospheric_conditions.humidity;
        const wind = data.atmospheric_conditions.wind;
        const solar = data.atmospheric_conditions.solar;
        const pressure = data.atmospheric_conditions.pressure;
        const lightning = data.atmospheric_conditions.lightning;
        const airQuality = data.atmospheric_conditions.air_quality;
        const modelOutput = data.model_output;

        const isToday = !dateOverride || dateOverride === new Date().toISOString().split('T')[0];
        
        document.getElementById('page-title').textContent = isToday ? "Today's Weather" : "Weather Details";
        document.getElementById('location-name').textContent = location.place_name;
        
        const dateDisplay = document.getElementById('date-display');
        if (dateOverride) {
            const date = new Date(dateOverride);
            dateDisplay.textContent = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } else {
            dateDisplay.textContent = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

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

        document.getElementById('forecast-summary').textContent = data.forecast_summary || '--';

        document.getElementById('temp-current').textContent = 
            `${WeatherUtils.formatTemperature(temp.surface_celsius)}°C`;
        document.getElementById('temp-feels').textContent = 
            `${WeatherUtils.formatTemperature(temp.dew_point_celsius)}°C`;
        document.getElementById('temp-range').textContent = 
            `${WeatherUtils.formatTemperature(temp.max_celsius)}°C / ${WeatherUtils.formatTemperature(temp.min_celsius)}°C`;

        document.getElementById('precip-prob').textContent = 
            `${Math.round(precip.probability * 100)}%`;
        document.getElementById('precip-intensity').textContent = 
            `${precip.intensity_mm_hr.toFixed(1)} mm/h`;
        document.getElementById('precip-type').textContent = 
            precip.type || 'none';

        document.getElementById('wind-speed').textContent = 
            `${WeatherUtils.formatWindSpeed(wind.speed_m_s)} km/h`;
        document.getElementById('wind-gusts').textContent = 
            `${WeatherUtils.formatWindSpeed(wind.gusts_m_s)} km/h`;
        document.getElementById('wind-direction').textContent = 
            `${wind.direction_deg}° ${getWindDirection(wind.direction_deg)}`;
        document.getElementById('humidity').textContent = 
            `${Math.round(humidity.relative_percent)}%`;
        document.getElementById('pressure').textContent = 
            `${pressure.surface_hpa.toFixed(1)} hPa ${pressure.trend ? '(' + pressure.trend + ')' : ''}`;

        document.getElementById('cloud-coverage').textContent = 
            `${Math.round(clouds.coverage_percent)}%`;
        document.getElementById('cloud-type').textContent = 
            clouds.type || '--';
        document.getElementById('solar-irradiance').textContent = 
            `${Math.round(solar.irradiance_w_m2)} W/m²`;
        document.getElementById('sunrise').textContent = 
            formatTime(solar.sunrise);
        document.getElementById('sunset').textContent = 
            formatTime(solar.sunset);

        document.getElementById('lightning-risk').textContent = 
            lightning.risk_level || '--';
        document.getElementById('air-quality').textContent = 
            airQuality.aerosol_optical_depth.toFixed(3);
        document.getElementById('confidence').textContent = 
            `${Math.round(modelOutput.confidence_score * 100)}%`;
    }

    function getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    function formatTime(isoString) {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    await loadDayWeather();
});
