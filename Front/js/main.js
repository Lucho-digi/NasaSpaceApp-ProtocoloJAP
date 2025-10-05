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
        const todayDay = document.getElementById('today-day');
        const todayIcon = document.getElementById('today-icon');
        const todayTemp = document.getElementById('today-temp');
        const todayMinmax = document.getElementById('today-minmax');
        
        if (!todayDay || !todayIcon || !todayTemp || !todayMinmax) return;

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

        todayDay.textContent = dayName;
        todayIcon.className = `wi ${icon} overview-icon`;
        todayTemp.textContent = `${WeatherUtils.formatTemperature(temp.surface_celsius)}°C`;
        todayMinmax.textContent = `Max: ${WeatherUtils.formatTemperature(temp.max_celsius)}°C / Min: ${WeatherUtils.formatTemperature(temp.min_celsius)}°C`;
    }

    function updateWeekOverview(weekData) {
        const weekPreview = document.getElementById('week-preview');
        if (!weekPreview) return;

        weekPreview.innerHTML = '';
        
        weekData.slice(0, 7).forEach((dayData) => {
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

            const dayDiv = document.createElement('div');
            dayDiv.className = 'week-preview-day';
            dayDiv.innerHTML = `
                <h3>${dayName}</h3>
                <i class="wi ${icon}" aria-hidden="true"></i>
                <p>${WeatherUtils.formatTemperature(temp.surface_celsius)}°C</p>
            `;
            
            weekPreview.appendChild(dayDiv);
        });
    }

    function setupForecastForm() {
        const forecastForm = document.querySelector('#specific form');
        const forecastResultSection = document.getElementById('forecast-result');
        const dateInput = document.getElementById('date');
        
        if (!forecastForm || !forecastResultSection) return;

        if (dateInput) {
            const today = new Date();
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(today.getFullYear() + 1);
            
            dateInput.value = today.toISOString().split('T')[0];
            dateInput.min = today.toISOString().split('T')[0];
            dateInput.max = oneYearFromNow.toISOString().split('T')[0];
        }

        forecastForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const locationInput = document.getElementById('location').value;
            const dateValue = document.getElementById('date').value;
            const hourValue = document.getElementById('hour').value;
            const minuteValue = document.getElementById('minute').value;
            const ampmValue = document.getElementById('ampm').value;
            const activityInput = document.getElementById('activity').value;

            let hour24 = parseInt(hourValue);
            if (ampmValue === 'PM' && hour24 !== 12) {
                hour24 += 12;
            } else if (ampmValue === 'AM' && hour24 === 12) {
                hour24 = 0;
            }
            
            const timeInput = `${String(hour24).padStart(2, '0')}:${minuteValue}`;

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

            const startTime = timeInput ? `${dateValue}T${timeInput}:00Z` : null;
            const endTime = startTime ? new Date(new Date(startTime).getTime() + 4 * 60 * 60 * 1000).toISOString() : null;

            const data = await WeatherAPI.fetchWeatherData(
                latitude,
                longitude,
                dateValue || null,
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
        const temp = data.atmospheric_conditions.temperature;
        const humidity = data.atmospheric_conditions.humidity;

        const activityNames = {
            'running': 'Running',
            'cycling': 'Cycling',
            'hiking': 'Hiking',
            'soccer': 'Playing Soccer',
            'tennis': 'Playing Tennis',
            'golf': 'Playing Golf',
            'park': 'Going to the Park',
            'picnic': 'Picnic',
            'beach': 'Beach Day',
            'fishing': 'Fishing',
            'camping': 'Camping',
            'gardening': 'Gardening',
            'eat-out': 'Eating Outdoors',
            'bbq': 'BBQ/Grilling',
            'wedding': 'Outdoor Wedding',
            'concert': 'Outdoor Concert',
            'festival': 'Festival/Fair',
            'stargazing': 'Stargazing',
            'photography': 'Photography',
            'bird-watching': 'Bird Watching',
            'aurora': 'Aurora Watching',
            'motorcycle': 'Motorcycle Ride',
            'drone': 'Flying Drone',
            'sailing': 'Sailing',
            'construction': 'Outdoor Construction',
            'painting': 'Exterior Painting',
            'car-wash': 'Car Washing'
        };

        activitySection.querySelector('h3 strong').textContent = activityNames[activity] || activity;

        let viable = true;
        let recommendation = '';
        let icon = 'wi-stars';

        switch(activity) {
            case 'stargazing':
            case 'aurora':
                icon = 'wi-stars';
                viable = precip.probability < 0.2 && clouds.coverage_percent < 25;
                recommendation = viable 
                    ? "Perfect conditions! Clear skies expected with minimal cloud coverage. Don't forget warm clothes!"
                    : "Not ideal. High cloud coverage and possible precipitation will obstruct visibility.";
                break;

            case 'running':
            case 'cycling':
            case 'hiking':
                icon = 'wi-day-sunny';
                viable = precip.probability < 0.3 && wind.speed_m_s < 8 && temp.surface_celsius > 5 && temp.surface_celsius < 32;
                if (viable) {
                    recommendation = temp.surface_celsius > 25 
                        ? "Good conditions! Stay hydrated and use sunscreen."
                        : "Great weather for it! Comfortable temperature and low wind.";
                } else if (precip.probability >= 0.3) {
                    recommendation = "Rain is likely. Consider rescheduling or bring waterproof gear.";
                } else if (temp.surface_celsius > 32) {
                    recommendation = "Too hot for safe outdoor exercise. Risk of heat exhaustion.";
                } else if (temp.surface_celsius < 5) {
                    recommendation = "Very cold conditions. Dress in layers if you must go.";
                } else {
                    recommendation = "Strong winds could make this challenging and uncomfortable.";
                }
                break;

            case 'soccer':
            case 'tennis':
            case 'golf':
                icon = 'wi-day-cloudy';
                viable = precip.probability < 0.4 && wind.speed_m_s < 10;
                recommendation = viable
                    ? "Good conditions for play! Low chance of rain interruption."
                    : precip.probability >= 0.4
                        ? "High chance of rain. Game might be interrupted or canceled."
                        : "Strong winds will affect ball trajectory significantly.";
                break;

            case 'park':
            case 'picnic':
                icon = 'wi-day-sunny';
                viable = precip.probability < 0.3 && wind.speed_m_s < 12 && temp.surface_celsius > 10;
                recommendation = viable
                    ? "Lovely weather! Perfect for outdoor relaxation."
                    : precip.probability >= 0.3
                        ? "Rain is likely. Consider an indoor alternative or bring shelter."
                        : temp.surface_celsius <= 10
                            ? "Quite cold. Bring warm blankets and hot beverages."
                            : "Windy conditions might scatter items and make it uncomfortable.";
                break;

            case 'beach':
                icon = 'wi-hot';
                viable = precip.probability < 0.2 && wind.speed_m_s < 15 && temp.surface_celsius > 20;
                recommendation = viable
                    ? "Beach day approved! Don't forget sunscreen and plenty of water."
                    : precip.probability >= 0.2
                        ? "Rain expected. Not ideal for the beach."
                        : temp.surface_celsius <= 20
                            ? "Too cold for swimming. Maybe a walk along the shore?"
                            : "Very windy. Sand will be blowing everywhere.";
                break;

            case 'fishing':
                icon = 'wi-cloudy';
                viable = precip.probability < 0.5 && wind.speed_m_s < 15;
                recommendation = viable
                    ? clouds.coverage_percent > 50
                        ? "Great! Fish are often more active on cloudy days."
                        : "Good conditions. Fish may be less active in bright sun."
                    : wind.speed_m_s >= 15
                        ? "Too windy for safe casting and boat control."
                        : "Heavy rain expected. Safety concern and poor visibility.";
                break;

            case 'camping':
                icon = 'wi-night-clear';
                viable = precip.probability < 0.3 && wind.speed_m_s < 12;
                recommendation = viable
                    ? "Good camping weather! Secure your tent well."
                    : precip.probability >= 0.3
                        ? "Rain likely. Ensure waterproof gear and elevated tent placement."
                        : "Strong winds. Use extra stakes and guy lines for tent stability.";
                break;

            case 'gardening':
                icon = 'wi-sprinkle';
                viable = precip.probability < 0.6 && temp.surface_celsius > 8 && temp.surface_celsius < 35;
                recommendation = viable
                    ? precip.probability > 0.2 && precip.probability < 0.4
                        ? "Perfect! Light rain expected - nature will water for you."
                        : "Good conditions for gardening work."
                    : precip.probability >= 0.6
                        ? "Heavy rain expected. Soil will be too muddy."
                        : "Temperature extreme. Not safe or productive for gardening.";
                break;

            case 'eat-out':
            case 'bbq':
            case 'wedding':
            case 'concert':
            case 'festival':
                icon = 'wi-day-sunny';
                viable = precip.probability < 0.25 && wind.speed_m_s < 15;
                recommendation = viable
                    ? "Excellent conditions! Your outdoor event should go smoothly."
                    : precip.probability >= 0.25
                        ? "Rain is possible. Have a backup plan or tent/canopy ready."
                        : "Strong winds may topple decorations and make dining uncomfortable.";
                break;

            case 'photography':
                icon = 'wi-day-cloudy';
                viable = wind.speed_m_s < 12;
                if (clouds.coverage_percent > 40 && clouds.coverage_percent < 80) {
                    recommendation = "Ideal! Partial clouds create beautiful lighting for photos.";
                } else if (clouds.coverage_percent < 20) {
                    recommendation = viable
                        ? "Clear skies. Great for landscapes but watch for harsh shadows."
                        : "Clear but windy. Stabilize your tripod well.";
                } else {
                    recommendation = "Overcast conditions. Good for portraits, challenging for landscapes.";
                }
                viable = viable && precip.probability < 0.3;
                if (!viable && precip.probability >= 0.3) {
                    recommendation = "Rain likely. Protect your equipment!";
                }
                break;

            case 'bird-watching':
                icon = 'wi-day-cloudy';
                viable = precip.probability < 0.4 && wind.speed_m_s < 15;
                recommendation = viable
                    ? "Good conditions. Birds are often active in calm weather."
                    : precip.probability >= 0.4
                        ? "Rain expected. Birds will be seeking shelter."
                        : "Too windy. Birds will be staying low and sheltered.";
                break;

            case 'motorcycle':
                icon = 'wi-cloudy-gusts';
                viable = precip.probability < 0.15 && wind.speed_m_s < 20 && temp.surface_celsius > 5;
                recommendation = viable
                    ? "Safe riding conditions! Always wear protective gear."
                    : precip.probability >= 0.15
                        ? "Wet roads are dangerous. Reduced traction and visibility."
                        : wind.speed_m_s >= 20
                            ? "Strong winds are hazardous for motorcycles. Avoid riding."
                            : "Too cold. Risk of hypothermia and reduced dexterity.";
                break;

            case 'drone':
                icon = 'wi-cloudy-windy';
                viable = precip.probability < 0.1 && wind.speed_m_s < 10;
                recommendation = viable
                    ? "Perfect flying conditions! Stable air and clear skies."
                    : precip.probability >= 0.1
                        ? "Don't risk it. Water damage and poor visibility."
                        : "Too windy. Risk of losing control or crashing your drone.";
                break;

            case 'sailing':
                icon = 'wi-strong-wind';
                viable = precip.probability < 0.4 && wind.speed_m_s > 3 && wind.speed_m_s < 20;
                if (viable) {
                    recommendation = wind.speed_m_s > 10
                        ? "Good winds for experienced sailors! Take precautions."
                        : "Nice sailing weather with gentle winds.";
                } else if (wind.speed_m_s <= 3) {
                    recommendation = "Not enough wind. You'll be becalmed.";
                } else if (wind.speed_m_s >= 20) {
                    recommendation = "Dangerous wind speeds. Stay in harbor.";
                } else {
                    recommendation = "Storm conditions expected. Do not sail.";
                }
                break;

            case 'construction':
                icon = 'wi-day-sunny';
                viable = precip.probability < 0.2 && wind.speed_m_s < 15 && temp.surface_celsius > 0;
                recommendation = viable
                    ? "Good working conditions. Proceed safely."
                    : precip.probability >= 0.2
                        ? "Rain will delay work and create safety hazards."
                        : temp.surface_celsius <= 0
                            ? "Freezing conditions. Materials won't cure properly."
                            : "High winds create serious safety risks with tools and materials.";
                break;

            case 'painting':
                icon = 'wi-day-sunny';
                viable = precip.probability < 0.1 && humidity.relative_percent < 80 && temp.surface_celsius > 10 && temp.surface_celsius < 32;
                recommendation = viable
                    ? "Ideal painting conditions! Paint will dry properly."
                    : precip.probability >= 0.1
                        ? "Rain will ruin fresh paint. Wait for dry weather."
                        : humidity.relative_percent >= 80
                            ? "Too humid. Paint won't dry properly."
                            : "Temperature outside ideal range. Affects paint curing.";
                break;

            case 'car-wash':
                icon = 'wi-day-sunny';
                viable = precip.probability < 0.15 && temp.surface_celsius > 5;
                recommendation = viable
                    ? "Good day for it! Your car will stay clean."
                    : precip.probability >= 0.15
                        ? "Rain expected soon. Why wash if it'll just get dirty again?"
                        : "Too cold. Water may freeze.";
                break;

            default:
                viable = precip.probability < 0.5 && wind.speed_m_s < 10;
                recommendation = viable
                    ? "Conditions look favorable for outdoor activity."
                    : "Weather conditions may not be ideal. Check details above.";
        }

        const recommendationBox = activitySection.querySelector('.recommendation-box');
        recommendationBox.className = `recommendation-box ${viable ? 'viable' : 'not-viable'}`;
        recommendationBox.querySelector('i').className = `wi ${icon}`;
        recommendationBox.querySelector('p').innerHTML = `<strong>${recommendation}</strong>`;
    }

    setupHamburgerMenu();
    setupThemeToggler();
    setupSpaNavigation();
    setupForecastForm();
    await loadOverviewData();
});
