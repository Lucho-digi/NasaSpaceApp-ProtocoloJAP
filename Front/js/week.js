document.addEventListener('DOMContentLoaded', async () => {
    async function loadWeeklyForecast() {
        const location = WeatherUtils.getStoredLocation();
        console.log('Loading weekly forecast for:', location);
        
        const weekData = await WeatherAPI.fetchWeeklyForecast(location.latitude, location.longitude);

        console.log('Week data received:', weekData);

        if (!weekData || weekData.length === 0) {
            console.error('Failed to load weekly forecast data');
            document.getElementById('week-accordion').innerHTML = '<p style="color: red; padding: 2rem;">Error loading data. Check console.</p>';
            return;
        }

        updateWeekPage(weekData, location);
    }

    function updateWeekPage(weekData, location) {
        const subtitle = document.getElementById('week-location');
        if (subtitle) {
            subtitle.textContent = location.place_name;
        }

        const weekAccordion = document.getElementById('week-accordion');
        if (!weekAccordion) {
            console.error('week-accordion element not found!');
            return;
        }

        console.log('Creating accordion for', weekData.length, 'days');
        weekAccordion.innerHTML = '';

        weekData.slice(0, 7).forEach((dayData, index) => {
            console.log(`Creating item ${index + 1}:`, dayData.date);
            const accordionItem = createAccordionItem(dayData, location);
            weekAccordion.appendChild(accordionItem);
        });

        // Add click handlers
        setupAccordionHandlers();
    }

    function createAccordionItem(dayData, location) {
        const temp = dayData.atmospheric_conditions.temperature;
        const precip = dayData.atmospheric_conditions.precipitation;
        const clouds = dayData.atmospheric_conditions.clouds;
        const wind = dayData.atmospheric_conditions.wind;
        const humidity = dayData.atmospheric_conditions.humidity;
        const solar = dayData.atmospheric_conditions.solar;
        const pressure = dayData.atmospheric_conditions.pressure;
        const lightning = dayData.atmospheric_conditions.lightning;
        const airQuality = dayData.atmospheric_conditions.air_quality;

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

        const item = document.createElement('div');
        item.className = 'accordion-item';
        
        item.innerHTML = `
            <div class="accordion-header">
                <div class="accordion-day-info">
                    <div class="accordion-day-main">
                        <h3>${dayName}</h3>
                        <span class="accordion-date">${dateFormatted}</span>
                    </div>
                    <div class="accordion-day-preview">
                        <i class="wi ${icon}" aria-hidden="true"></i>
                        <span class="accordion-condition">${condition}</span>
                        <span class="accordion-temp">${WeatherUtils.formatTemperature(temp.max_celsius)}° / ${WeatherUtils.formatTemperature(temp.min_celsius)}°</span>
                    </div>
                </div>
                <i class="accordion-arrow wi wi-direction-down"></i>
            </div>
            <div class="accordion-content">
                <div class="accordion-details">
                    <div class="details-column">
                        <h4>🌡️ Temperature</h4>
                        <p><span>Current:</span> <strong>${WeatherUtils.formatTemperature(temp.surface_celsius)}°C</strong></p>
                        <p><span>Feels like:</span> <strong>${WeatherUtils.formatTemperature(temp.dew_point_celsius)}°C</strong></p>
                        <p><span>Max / Min:</span> <strong>${WeatherUtils.formatTemperature(temp.max_celsius)}°C / ${WeatherUtils.formatTemperature(temp.min_celsius)}°C</strong></p>
                    </div>
                    
                    <div class="details-column">
                        <h4>💧 Precipitation</h4>
                        <p><span>Probability:</span> <strong>${Math.round(precip.probability * 100)}%</strong></p>
                        <p><span>Intensity:</span> <strong>${precip.intensity_mm_hr.toFixed(1)} mm/h</strong></p>
                        <p><span>Type:</span> <strong>${precip.type || 'none'}</strong></p>
                    </div>
                    
                    <div class="details-column">
                        <h4>💨 Wind & Air</h4>
                        <p><span>Wind Speed:</span> <strong>${WeatherUtils.formatWindSpeed(wind.speed_m_s)} km/h</strong></p>
                        <p><span>Wind Gusts:</span> <strong>${WeatherUtils.formatWindSpeed(wind.gusts_m_s || wind.gust_m_s)} km/h</strong></p>
                        <p><span>Direction:</span> <strong>${getWindDirection(wind.direction_deg || wind.direction_degrees)}</strong></p>
                        <p><span>Humidity:</span> <strong>${Math.round(humidity.relative_percent)}%</strong></p>
                        <p><span>Pressure:</span> <strong>${pressure.surface_hpa.toFixed(1)} hPa</strong></p>
                    </div>
                    
                    <div class="details-column">
                        <h4>☁️ Clouds & Sun</h4>
                        <p><span>Cloud Coverage:</span> <strong>${Math.round(clouds.coverage_percent)}%</strong></p>
                        <p><span>Cloud Type:</span> <strong>${clouds.type || 'N/A'}</strong></p>
                        <p><span>Solar Radiation:</span> <strong>${solar.irradiance_w_m2.toFixed(0)} W/m²</strong></p>
                        <p><span>Sunrise:</span> <strong>${formatTime(solar.sunrise || solar.sunrise_utc)}</strong></p>
                        <p><span>Sunset:</span> <strong>${formatTime(solar.sunset || solar.sunset_utc)}</strong></p>
                    </div>
                    
                    <div class="details-column">
                        <h4>ℹ️ Additional Info</h4>
                        <p><span>Lightning Risk:</span> <strong>${lightning?.risk_level || lightning?.risk || 'low'}</strong></p>
                        <p><span>Air Quality (AOD):</span> <strong>${(airQuality?.aerosol_optical_depth || airQuality?.aod || 0).toFixed(3)}</strong></p>
                        <p><span>Confidence:</span> <strong>${Math.round((dayData.model_output?.confidence_score || dayData.model_output?.confidence || 0) * 100)}%</strong></p>
                    </div>
                </div>
            </div>
        `;

        return item;
    }

    function setupAccordionHandlers() {
        const headers = document.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = item.querySelector('.accordion-content');
                const arrow = header.querySelector('.accordion-arrow');
                
                // Close all other items
                document.querySelectorAll('.accordion-item').forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        otherItem.querySelector('.accordion-arrow').style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    content.style.maxHeight = null;
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    function getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return `${directions[index]} ${degrees}`;
    }

    function formatTime(isoString) {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    await loadWeeklyForecast();
});
