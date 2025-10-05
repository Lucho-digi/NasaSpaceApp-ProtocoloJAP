document.addEventListener('DOMContentLoaded', async () => {
    function setupHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    function setupThemeToggler() {
        const themeToggler = document.getElementById('theme-toggler');
        if (!themeToggler) return;

        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
        }

        themeToggler.addEventListener('click', () => {
            if (html.getAttribute('data-theme') === 'light') {
                html.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    function setupSpaNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        const sections = document.querySelectorAll('main > section');

        function showSection(targetId) {
            sections.forEach(section => {
                if (section.id === 'overview' || section.id === 'specific') {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === targetId);
            });
        }

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSection(targetId);
                });
            }
        });

        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            if (!window.location.hash) {
                showSection('#specific');
            }
        }
    }

    async function loadOverviewData() {
        if (!document.getElementById('overview')) return;

        const location = WeatherUtils.getStoredLocation();
        const todayData = await WeatherAPI.fetchWeatherData(location.latitude, location.longitude);
        const weekData = await WeatherAPI.fetchWeeklyForecast(location.latitude, location.longitude);

        if (todayData) {
            updateTodayOverview(todayData);
        }

        if (weekData && weekData.length > 0) {
            updateWeekOverview(weekData);
        }
    }

    function updateTodayOverview(data) {
        const overviewCard = document.querySelector('.overview-card-link:first-child .card');
        if (!overviewCard) return;

        const temp = data.atmospheric_conditions.temperature;
        const precip = data.atmospheric_conditions.precipitation;
        const clouds = data.atmospheric_conditions.clouds;

        const dayName = WeatherUtils.getDayName(data.date);
        const icon = WeatherUtils.getWeatherIcon(
            WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent),
            precip.probability,
            clouds.coverage_percent,
            'day'
        );

        overviewCard.querySelector('.overview-header p').textContent = dayName;
        overviewCard.querySelector('.overview-icon').className = `wi ${icon} overview-icon`;
        overviewCard.querySelector('.overview-temp').textContent = 
            `${WeatherUtils.formatTemperature(temp.surface_celsius)}°C`;
        overviewCard.querySelector('.overview-minmax').textContent = 
            `Max: ${WeatherUtils.formatTemperature(temp.max_celsius)}°C / Min: ${WeatherUtils.formatTemperature(temp.min_celsius)}°C`;
    }

    function updateWeekOverview(weekData) {
        const weekPreview = document.querySelector('.week-preview');
        if (!weekPreview) return;

        const days = weekPreview.querySelectorAll('.week-preview-day');
        
        weekData.slice(0, 6).forEach((dayData, index) => {
            if (!days[index]) return;

            const temp = dayData.atmospheric_conditions.temperature;
            const precip = dayData.atmospheric_conditions.precipitation;
            const clouds = dayData.atmospheric_conditions.clouds;

            const date = new Date(dayData.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const icon = WeatherUtils.getWeatherIcon(
                WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent),
                precip.probability,
                clouds.coverage_percent,
                'day'
            );

            days[index].querySelector('h3').textContent = dayName;
            days[index].querySelector('i').className = `wi ${icon}`;
            days[index].querySelector('p').textContent = 
                `${WeatherUtils.formatTemperature(temp.surface_celsius)}°C`;
        });
    }

    function setupForecastForm() {
        const forecastForm = document.querySelector('#specific form');
        const forecastResultSection = document.getElementById('forecast-result');
        if (!forecastForm || !forecastResultSection) return;

        forecastForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const locationInput = document.getElementById('location').value;
            const dateInput = document.getElementById('date').value;
            const timeInput = document.getElementById('time').value;
            const activityInput = document.getElementById('activity').value;

            let latitude, longitude;
            if (locationInput && locationInput.includes(',')) {
                const coords = locationInput.split(',').map(c => parseFloat(c.trim()));
                latitude = coords[0];
                longitude = coords[1];
            } else {
                const location = WeatherUtils.getStoredLocation();
                latitude = location.latitude;
                longitude = location.longitude;
            }

            const startTime = timeInput ? `${dateInput}T${timeInput}:00Z` : null;
            const endTime = startTime ? new Date(new Date(startTime).getTime() + 4 * 60 * 60 * 1000).toISOString() : null;

            const data = await WeatherAPI.fetchWeatherData(
                latitude,
                longitude,
                dateInput || null,
                startTime,
                endTime
            );

            if (data) {
                updateForecastResult(data, activityInput);
                forecastResultSection.classList.remove('hidden');
                forecastResultSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    function updateForecastResult(data, activity) {
        const resultCard = document.querySelector('.result-card');
        if (!resultCard) return;

        const location = data.location;
        const temp = data.atmospheric_conditions.temperature;
        const precip = data.atmospheric_conditions.precipitation;
        const clouds = data.atmospheric_conditions.clouds;
        const humidity = data.atmospheric_conditions.humidity;
        const wind = data.atmospheric_conditions.wind;

        resultCard.querySelector('.result-header h2 strong').textContent = location.place_name;
        resultCard.querySelector('.result-header p strong').textContent = data.date;

        const icon = WeatherUtils.getWeatherIcon(
            WeatherUtils.getConditionText(precip.probability, clouds.coverage_percent),
            precip.probability,
            clouds.coverage_percent,
            'day'
        );
        resultCard.querySelector('.result-main i').className = `wi ${icon}`;
        resultCard.querySelector('.result-temp').textContent = 
            `${WeatherUtils.formatTemperature(temp.surface_celsius)}°C`;
        resultCard.querySelector('.result-condition').textContent = data.forecast_summary;

        const details = resultCard.querySelectorAll('.detail-item');
        details[0].querySelector('strong').textContent = 
            `${WeatherUtils.formatTemperature(temp.dew_point_celsius)}°C`;
        details[1].querySelector('strong').textContent = `${Math.round(humidity.relative_percent)}%`;
        details[2].querySelector('strong').textContent = 
            `${precip.intensity_mm_hr.toFixed(1)} mm/h`;
        details[3].querySelector('strong').textContent = `${Math.round(precip.probability * 100)}%`;

        if (activity !== 'none') {
            updateActivityRecommendation(data, activity);
        } else {
            resultCard.querySelector('.result-activity').style.display = 'none';
        }
    }

    function updateActivityRecommendation(data, activity) {
        const activitySection = document.querySelector('.result-activity');
        if (!activitySection) return;

        activitySection.style.display = 'block';

        const precip = data.atmospheric_conditions.precipitation;
        const wind = data.atmospheric_conditions.wind;
        const clouds = data.atmospheric_conditions.clouds;

        const activityNames = {
            'eat-out': 'Eating out',
            'park': 'Going to the park',
            'stargazing': 'Stargazing'
        };

        activitySection.querySelector('h3 strong').textContent = activityNames[activity] || activity;

        let viable = true;
        let recommendation = '';

        if (activity === 'stargazing') {
            viable = precip.probability < 0.3 && clouds.coverage_percent < 30;
            recommendation = viable 
                ? "It's a great night for it! The sky is expected to be clear and the wind is calm."
                : "Not ideal conditions. High cloud coverage and possible rain make visibility poor.";
        } else if (activity === 'park' || activity === 'eat-out') {
            viable = precip.probability < 0.5 && wind.speed_m_s < 10;
            recommendation = viable
                ? "Perfect conditions! Low chance of rain and comfortable weather."
                : "You might want to reconsider. Rain is likely and winds could be strong.";
        }

        const recommendationBox = activitySection.querySelector('.recommendation-box');
        recommendationBox.className = `recommendation-box ${viable ? 'viable' : 'not-viable'}`;
        recommendationBox.querySelector('p').innerHTML = `<strong>${recommendation}</strong>`;
    }

    setupHamburgerMenu();
    setupThemeToggler();
    setupSpaNavigation();
    setupForecastForm();
    await loadOverviewData();
});
