document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        const map = L.map('map').setView([-34.6037, -58.3816], 10); // Default to Buenos Aires

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let marker;
        const locationInput = document.getElementById('location');

        function onMapClick(e) {
            const lat = e.latlng.lat.toFixed(4);
            const lng = e.latlng.lng.toFixed(4);

            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker(e.latlng).addTo(map);
            locationInput.value = `${lat}, ${lng}`;
        }

        map.on('click', onMapClick);
    }
});