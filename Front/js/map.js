document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        const storedLocation = WeatherUtils.getStoredLocation();
        const map = L.map('map').setView([storedLocation.latitude, storedLocation.longitude], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let marker = L.marker([storedLocation.latitude, storedLocation.longitude]).addTo(map);
        const locationInput = document.getElementById('location');
        
        if (locationInput) {
            locationInput.value = `${storedLocation.latitude.toFixed(4)}, ${storedLocation.longitude.toFixed(4)}`;
        }

        async function reverseGeocode(lat, lng) {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            } catch (error) {
                console.error('Reverse geocoding failed:', error);
                return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
        }

        async function onMapClick(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker(e.latlng).addTo(map);
            locationInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            console.log('Ubicación seleccionada en mapa (solo para formulario):', lat, lng);
        }

        map.on('click', onMapClick);
    }
});
