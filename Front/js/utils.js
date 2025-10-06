const API_BASE_URL = typeof API_CONFIG !== 'undefined' ? API_CONFIG.BASE_URL : 'http://localhost:8000/api';
const USE_MOCK_DATA = typeof API_CONFIG !== 'undefined' ? API_CONFIG.USE_MOCK_DATA : false;

const WeatherAPI = {
    async fetchWeatherData(latitude, longitude, date = null, startTime = null, endTime = null, providedPlaceName = null) {
        if (USE_MOCK_DATA) {
            return await this.getMockWeatherData(latitude, longitude, date);
        }
        
        try {
            const config = API_CONFIG.OPEN_METEO;
            const currentParams = config.CURRENT_PARAMS.join(',');
            const dailyParams = config.DAILY_PARAMS.join(',');
            
            const url = `${config.BASE_URL}/forecast?` +
                `latitude=${latitude}&longitude=${longitude}` +
                `&current=${currentParams}` +
                `&daily=${dailyParams}` +
                `&timezone=${config.TIMEZONE}` +
                `&forecast_days=1`;
            
            console.log('Fetching from Open-Meteo:', url);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Usar el nombre del lugar proporcionado o obtenerlo usando geocoding
            const placeName = providedPlaceName || await this.getPlaceNameFromCoords(latitude, longitude);
            
            return this.transformOpenMeteoCurrentData(data, latitude, longitude, placeName, date);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            console.warn('Falling back to mock data...');
            return await this.getMockWeatherData(latitude, longitude, date);
        }
    },

    async fetchWeeklyForecast(latitude, longitude) {
        if (USE_MOCK_DATA) {
            return await this.getMockWeeklyData(latitude, longitude);
        }
        
        try {
            const config = API_CONFIG.OPEN_METEO;
            const dailyParams = config.DAILY_PARAMS.join(',');
            
            const url = `${config.BASE_URL}/forecast?` +
                `latitude=${latitude}&longitude=${longitude}` +
                `&daily=${dailyParams}` +
                `&timezone=${config.TIMEZONE}` +
                `&forecast_days=7`;
            
            console.log('Fetching weekly from Open-Meteo:', url);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            const placeName = await this.getPlaceNameFromCoords(latitude, longitude);
            
            return this.transformOpenMeteoWeeklyData(data, latitude, longitude, placeName);
        } catch (error) {
            console.error('Error fetching weekly forecast:', error);
            console.warn('Falling back to mock data...');
            return await this.getMockWeeklyData(latitude, longitude);
        }
    },

    async getPlaceNameFromCoords(latitude, longitude) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es,en`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (data && data.address) {
                const address = data.address;
                const parts = [];
                
                if (address.city) parts.push(address.city);
                else if (address.town) parts.push(address.town);
                else if (address.village) parts.push(address.village);
                else if (address.municipality) parts.push(address.municipality);
                else if (address.hamlet) parts.push(address.hamlet);
                
                if (address.state) parts.push(address.state);
                else if (address.region) parts.push(address.region);
                
                if (address.country) parts.push(address.country);
                
                if (parts.length > 0) {
                    return parts.join(', ');
                }
            }
            
        } catch (error) {
            console.warn('Could not get place name:', error);
        }
        if (latitude >= -35 && latitude <= -30 && longitude >= -58 && longitude <= -53) {
            if (latitude >= -34.8 && latitude <= -34.7 && longitude >= -56.1 && longitude <= -55.9) {
                return 'Canelones, Uruguay';
            } else if (latitude >= -34.95 && latitude <= -34.85 && longitude >= -56.25 && longitude <= -56.15) {
                return 'Montevideo, Uruguay';
            } else {
                return 'Uruguay';
            }
        }
        
        return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    },

    transformOpenMeteoCurrentData(omData, latitude, longitude, placeName, date = null) {
        console.log('Transformando datos Open-Meteo:', omData);
        
        if (!omData || !omData.current) {
            console.error('Datos de Open-Meteo incompletos:', omData);
            throw new Error('Datos del clima incompletos');
        }
        
        const now = new Date();
        const currentDate = date || now.toISOString().split('T')[0];
        
        const current = omData.current;
        const daily = omData.daily;
        
        // Obtener sunrise y sunset del daily si está disponible
        const sunrise = daily?.sunrise?.[0] || now.toISOString();
        const sunset = daily?.sunset?.[0] || now.toISOString();
        
        // Convertir weather_code a descripción
        const weatherDescription = this.getWeatherDescription(current.weather_code);
        
        // Calcular probabilidad de lluvia basada en precipitación
        const precipitationRate = current.precipitation || 0;
        const precipitationProb = Math.min(precipitationRate / 2.0, 1);
        
        return {
            location: {
                latitude: latitude,
                longitude: longitude,
                place_name: placeName,
                grid_resolution_deg: 0.5
            },
            date: currentDate,
            time_window: {
                start: now.toISOString(),
                end: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()
            },
            data_sources: {
                power_api: {
                    description: "Open-Meteo API — current weather data",
                    variables: ["temperature_2m", "pressure_msl", "relative_humidity_2m", "wind_speed_10m"],
                    update_frequency: "hourly"
                }
            },
            forecast_summary: weatherDescription,
            atmospheric_conditions: {
                precipitation: {
                    probability: precipitationProb,
                    type: precipitationRate > 0 ? "rain" : "none",
                    intensity_mm_hr: precipitationRate,
                    cloud_top_temp_k: (current.temperature_2m || 15) + 273.15
                },
                temperature: {
                    surface_celsius: current.temperature_2m || 20,
                    dew_point_celsius: current.apparent_temperature || current.temperature_2m || 20,
                    min_celsius: daily?.temperature_2m_min?.[0] || current.temperature_2m || 18,
                    max_celsius: daily?.temperature_2m_max?.[0] || current.temperature_2m || 25
                },
                humidity: {
                    relative_percent: current.relative_humidity_2m || 50,
                    specific_humidity_kg_kg: (current.relative_humidity_2m || 50) / 1000
                },
                wind: {
                    speed_m_s: current.wind_speed_10m || 0,
                    direction_deg: current.wind_direction_10m || 0,
                    gusts_m_s: current.wind_gusts_10m || (current.wind_speed_10m || 0) * 1.5
                },
                solar: {
                    irradiance_w_m2: Math.max(0, 800 * (1 - (current.cloud_cover || 0) / 100)),
                    clearsky_index: 1 - ((current.cloud_cover || 0) / 100),
                    sunrise: sunrise,
                    sunset: sunset
                },
                clouds: {
                    coverage_percent: current.cloud_cover || 0,
                    optical_depth: (current.cloud_cover || 0) / 5,
                    type: this.getCloudType(current.weather_code)
                },
                pressure: {
                    surface_hpa: current.pressure_msl || current.surface_pressure || 1013,
                    trend: "steady"
                },
                lightning: {
                    activity_index: 0.0,
                    risk_level: "low"
                },
                air_quality: {
                    aerosol_optical_depth: 0.15,
                    ozone_du: 290.0
                }
            },
            model_output: {
                rain_forecast_index: precipitationProb,
                confidence_score: 0.90,
                model_version: "open-meteo-v1"
            },
            metadata: {
                queried_at: now.toISOString(),
                api_version: "1.0.0",
                units: {
                    temperature: "°C",
                    pressure: "hPa",
                    irradiance: "W/m²",
                    precipitation: "mm/h",
                    wind: "m/s"
                }
            }
        };
    },

    transformOpenMeteoWeeklyData(omData, latitude, longitude, placeName) {
        console.log('Transformando datos semanales Open-Meteo:', omData);
        
        if (!omData || !omData.daily) {
            console.error('Datos semanales de Open-Meteo incompletos:', omData);
            throw new Error('Datos del pronóstico incompletos');
        }
        
        const daily = omData.daily;
        const weeklyData = [];
        
        // Crear un objeto de datos para cada día
        for (let i = 0; i < Math.min(7, daily.time.length); i++) {
            const dateString = daily.time[i];
            const weatherCode = daily.weather_code[i];
            const weatherDescription = this.getWeatherDescription(weatherCode);
            
            const precipSum = daily.precipitation_sum[i] || 0;
            const precipProb = daily.precipitation_probability_max && daily.precipitation_probability_max[i] 
                ? daily.precipitation_probability_max[i] 
                : (precipSum > 1 ? Math.min(precipSum * 10, 80) : (precipSum > 0 ? 20 : 5));
            
            weeklyData.push({
                location: {
                    latitude: latitude,
                    longitude: longitude,
                    place_name: placeName,
                    grid_resolution_deg: 0.5
                },
                date: dateString,
                forecast_summary: weatherDescription,
                atmospheric_conditions: {
                    precipitation: {
                        probability: precipProb / 100,
                        type: precipSum > 0 ? "rain" : "none",
                        intensity_mm_hr: precipSum / 24, // Convertir mm/día a mm/h promedio
                        cloud_top_temp_k: (daily.temperature_2m_min[i] || 15) + 273.15
                    },
                    temperature: {
                        surface_celsius: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
                        dew_point_celsius: daily.apparent_temperature_min[i] || daily.temperature_2m_min[i],
                        min_celsius: daily.temperature_2m_min[i] || 18,
                        max_celsius: daily.temperature_2m_max[i] || 25
                    },
                    humidity: {
                        relative_percent: this.estimateHumidityFromWeatherCode(weatherCode, precipSum),
                        specific_humidity_kg_kg: this.estimateHumidityFromWeatherCode(weatherCode, precipSum) / 1000
                    },
                    wind: {
                        speed_m_s: daily.wind_speed_10m_max[i] || 0,
                        direction_deg: daily.wind_direction_10m_dominant[i] || 0,
                        gusts_m_s: daily.wind_gusts_10m_max[i] || (daily.wind_speed_10m_max[i] || 0) * 1.5
                    },
                    solar: {
                        irradiance_w_m2: Math.max(0, 800 * (1 - this.getCloudCoverageFromWeatherCode(weatherCode) / 100)),
                        clearsky_index: 1 - (this.getCloudCoverageFromWeatherCode(weatherCode) / 100),
                        sunrise: daily.sunrise[i] || new Date().toISOString(),
                        sunset: daily.sunset[i] || new Date().toISOString()
                    },
                    clouds: {
                        coverage_percent: this.getCloudCoverageFromWeatherCode(weatherCode),
                        optical_depth: this.getCloudCoverageFromWeatherCode(weatherCode) / 5,
                        type: this.getCloudType(weatherCode)
                    },
                    pressure: {
                        surface_hpa: 1013, // Open-Meteo no incluye presión diaria por defecto
                        trend: "steady"
                    },
                    lightning: {
                        activity_index: this.isThunderstorm(weatherCode) ? 0.5 : 0.0,
                        risk_level: this.isThunderstorm(weatherCode) ? "medium" : "low"
                    },
                    air_quality: {
                        aerosol_optical_depth: 0.15,
                        ozone_du: 290.0
                    }
                },
                model_output: {
                    rain_forecast_index: precipProb / 100,
                    confidence_score: 0.92,
                    model_version: "open-meteo-v1"
                }
            });
        }
        
        return weeklyData;
    },

    // Funciones auxiliares para Open-Meteo
    getWeatherDescription(weatherCode) {
        const codes = {
            0: 'Despejado',
            1: 'Mayormente despejado', 
            2: 'Parcialmente nublado',
            3: 'Nublado',
            45: 'Niebla',
            48: 'Niebla con escarcha',
            51: 'Llovizna ligera',
            53: 'Llovizna moderada', 
            55: 'Llovizna intensa',
            56: 'Llovizna helada ligera',
            57: 'Llovizna helada intensa',
            61: 'Lluvia ligera',
            63: 'Lluvia moderada',
            65: 'Lluvia intensa',
            66: 'Lluvia helada ligera',
            67: 'Lluvia helada intensa',
            71: 'Nieve ligera',
            73: 'Nieve moderada',
            75: 'Nieve intensa',
            77: 'Granizo',
            80: 'Chubascos ligeros',
            81: 'Chubascos moderados',
            82: 'Chubascos intensos',
            85: 'Chubascos de nieve ligeros',
            86: 'Chubascos de nieve intensos',
            95: 'Tormenta',
            96: 'Tormenta con granizo ligero',
            99: 'Tormenta con granizo intenso'
        };
        return codes[weatherCode] || 'Condiciones desconocidas';
    },

    getCloudType(weatherCode) {
        if (weatherCode >= 95) return 'cumulonimbus';
        if (weatherCode >= 80) return 'cumulus';
        if (weatherCode >= 61) return 'nimbostratus';
        if (weatherCode >= 45) return 'stratus';
        if (weatherCode >= 2) return 'cumulus';
        return 'clear';
    },

    getCloudCoverageFromWeatherCode(weatherCode) {
        if (weatherCode === 0) return 0;   // Despejado
        if (weatherCode === 1) return 25;  // Mayormente despejado
        if (weatherCode === 2) return 50;  // Parcialmente nublado
        if (weatherCode === 3) return 85;  // Nublado
        if (weatherCode >= 45 && weatherCode <= 48) return 100; // Niebla
        if (weatherCode >= 51) return 90;  // Precipitación = muy nublado
        return 50; // Por defecto
    },

    isThunderstorm(weatherCode) {
        return weatherCode >= 95 && weatherCode <= 99;
    },

    estimateHumidityFromWeatherCode(weatherCode, precipitation) {
        // Estimar humedad basada en condiciones del clima
        if (weatherCode >= 61 && weatherCode <= 67) return 85; // Lluvia
        if (weatherCode >= 71 && weatherCode <= 77) return 90; // Nieve
        if (weatherCode >= 80 && weatherCode <= 86) return 80; // Chubascos
        if (weatherCode >= 95) return 90; // Tormentas
        if (weatherCode >= 45 && weatherCode <= 48) return 95; // Niebla
        if (weatherCode === 3) return 70; // Nublado
        if (weatherCode === 2) return 60; // Parcialmente nublado
        if (weatherCode === 1) return 50; // Mayormente despejado
        if (weatherCode === 0) return 45; // Despejado
        
        // Si hay precipitación, usar eso como indicador
        if (precipitation > 5) return 85;
        if (precipitation > 1) return 70;
        if (precipitation > 0) return 60;
        
        return 55; // Valor por defecto
    },

    async getMockWeatherData(latitude, longitude, date = null) {
        try {
            const isInPagesFolder = window.location.pathname.includes('/pages/');
            const basePath = isInPagesFolder ? '../' : './';
            const response = await fetch(`${basePath}example-api-response.json`);
            const mockData = await response.json();
            
            mockData.location.latitude = latitude;
            mockData.location.longitude = longitude;
            if (date) {
                mockData.date = date;
            }
            
            return mockData;
        } catch (error) {
            console.error('Error loading mock data:', error);
            return null;
        }
    },

    async getMockWeeklyData(latitude, longitude) {
        try {
            const isInPagesFolder = window.location.pathname.includes('/pages/');
            const basePath = isInPagesFolder ? '../' : './';
            const response = await fetch(`${basePath}example-weekly-response.json`);
            const mockData = await response.json();
            
            mockData.forEach(day => {
                day.location.latitude = latitude;
                day.location.longitude = longitude;
            });
            
            return mockData;
        } catch (error) {
            console.error('Error loading mock weekly data:', error);
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
                console.warn('Geolocation no está disponible en este navegador');
                reject(new Error('Geolocation is not supported'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000, // 10 segundos
                maximumAge: 300000 // 5 minutos
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Ubicación detectada exitosamente:', {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Error de geolocalización:', error.message);
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            console.warn('Permiso de ubicación denegado por el usuario');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.warn('Información de ubicación no disponible');
                            break;
                        case error.TIMEOUT:
                            console.warn('Tiempo de espera agotado para obtener ubicación');
                            break;
                    }
                    reject(error);
                },
                options
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
