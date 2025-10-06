document.addEventListener('DOMContentLoaded', () => {
    async function showForecast() {

        // Tomamos los valores del formulario
        const locationInput = document.getElementById('location').value.trim();
        const dateInput = document.getElementById('date').value;
        const hour = document.getElementById('hour').value;
        const minute = document.getElementById('minute').value;
        const ampm = document.getElementById('ampm').value;
        const activity = document.getElementById('activity').value;

        // Parseamos lat/lng
        const [lat, lng] = locationInput.split(',').map(x => parseFloat(x.trim()));

        // Convertimos hora a 24h
        let hour24 = parseInt(hour);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;

        // Creamos datetime en formato ISO
        const datetime = `${dateInput}T${String(hour24).padStart(2, '0')}:${minute}:00`;

        // API KEY
        const apiKey = '7146f14366997fcbfd08af508650512ba8e682abc7697298ea9f5097e58b1247'

        // URL de la API
        const apiUrl = 'http://9.234.138.111:8000/forecast';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey  // ✅ Aquí va la API key
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    date: datetime
                })
            });

            const data = await response.json();

            // Variables dinámicas para el forecast
            const locationName = ''; // podes poner el nombre real según lat/lng
            const forecastDate = data.date || dateInput;
            const temperature = data.temperature || '';
            const feelsLike = ''; // opcional
            const humidity = data.humidity || '';
            const precipitation = data.precipitation || '';
            const rainProbability = data.rain_probability || '';
            const condition = ''; // Ej: "Rain likely"
            const activityName = activity !== 'none' ? activity : 'No activity selected';
            const activityRecommendation = ''; // poner texto de recomendación
            const activityClass = 'viable'; // o 'not-viable'
            const weatherIconClass = 'wi wi-rain'; // icono del clima
            const activityIconClass = 'wi wi-stars'; // icono de la actividad

            // Generamos HTML
            const forecastHTML = `
                    <h1>Forecast Result</h1>
                    <div class="card result-card">
                        <div class="result-header">
                            <h2>Weather for <strong>${locationName}</strong></h2>
                            <p>On <strong>${forecastDate}</strong></p>
                        </div>
                        <div class="result-body">
                            <div class="result-main">
                                <i class="${weatherIconClass}" aria-hidden="true"></i>
                                <div class="result-temp-container">
                                    <p class="result-temp">${temperature}°C</p>
                                    <p class="result-condition">${condition}</p>
                                </div>
                            </div>
                            <div class="result-details">
                                <div class="detail-item"><span>Feels like (Heat Index)</span> <strong>${feelsLike}°C</strong></div>
                                <div class="detail-item"><span>Humidity</span> <strong>${humidity}%</strong></div>
                                <div class="detail-item"><span>Precipitation</span> <strong>${precipitation} mm</strong></div>
                                <div class="detail-item"><span>Rain Probability</span> <strong>${rainProbability}%</strong></div>
                            </div>
                        </div>
                        <div class="result-activity">
                            <h3>Recommendation for: <strong>${activityName}</strong></h3>
                            <div class="recommendation-box ${activityClass}">
                                <i class="${activityIconClass}" aria-hidden="true"></i>
                                <p><strong>${activityRecommendation}</strong></p>
                            </div>
                        </div>
                    </div>
                `;

            // Insertamos en la sección forecast-result
            document.getElementById('forecast-result').innerHTML = forecastHTML;

        } catch (error) {
            console.error('Error fetching forecast:', error);
            document.getElementById('forecast-result').innerHTML = '<p>Unable to load forecast data.</p>';
        }
    }



    showForecast();
});