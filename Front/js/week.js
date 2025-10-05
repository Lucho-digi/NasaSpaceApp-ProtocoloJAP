document.addEventListener('DOMContentLoaded', async () => {
    async function loadWeeklyForecast() {
        const location = WeatherUtils.getStoredLocation();
        const weekData = await WeatherAPI.fetchWeeklyForecast(location.latitude, location.longitude);

        if (!weekData || weekData.length === 0) {
            console.error('Failed to load weekly forecast data');
            return;
        }

        updateWeekPage(weekData, location);
    }

    function updateWeekPage(weekData, location) {
        const subtitle = document.querySelector('.week-subtitle');
        if (subtitle) {
            subtitle.textContent = location.place_name;
        }

        const weekCards = document.querySelector('.week-cards');
        if (!weekCards) return;

        weekCards.innerHTML = '';

        weekData.slice(0, 6).forEach(dayData => {
            const card = createDayCard(dayData, location);
            weekCards.appendChild(card);
        });
    }

    function createDayCard(dayData, location) {
        const temp = dayData.atmospheric_conditions.temperature;
        const precip = dayData.atmospheric_conditions.precipitation;
        const clouds = dayData.atmospheric_conditions.clouds;
        const wind = dayData.atmospheric_conditions.wind;

        const date = new Date(dayData.date);
        const dayName = WeatherUtils.getDayName(dayData.date);
        const dateFormatted = WeatherUtils.formatDate(dayData.date);
        
        const icon = WeatherUtils.getWeatherIcon(
            WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent),
            precip.probability,
            clouds.coverage_percent,
            'day'
        );
        const condition = WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent);

        const card = document.createElement('a');
        card.href = `today.html?date=${dayData.date}&lat=${location.latitude}&lon=${location.longitude}`;
        card.className = 'day-card-link';
        
        card.innerHTML = `
            <div class="day-card">
                <div class="day-card-header">
                    <h3>${dayName}</h3>
                    <span class="day-date">${dateFormatted}</span>
                </div>
                <i class="wi ${icon}" aria-hidden="true"></i>
                <p class="day-condition">${condition}</p>
                <div class="day-temp">
                    <span class="temp-max">${WeatherUtils.formatTemperature(temp.max_celsius)}°</span>
                    <span class="temp-min">${WeatherUtils.formatTemperature(temp.min_celsius)}°</span>
                </div>
                <div class="day-extra">
                    <span><i class="wi wi-raindrop"></i> ${Math.round(precip.probability * 100)}%</span>
                    <span><i class="wi wi-strong-wind"></i> ${WeatherUtils.formatWindSpeed(wind.speed_m_s)} km/h</span>
                </div>
            </div>
        `;

        return card;
    }

    await loadWeeklyForecast();
});
