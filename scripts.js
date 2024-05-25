// scripts.js

// Function to fetch timezone information based on latitude and longitude
async function fetchTimezone(lat, lon) {
    const apiKey = 'YOUR_GEOAPIFY_API_KEY';
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&type=timezone&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
        return data.features[0].properties.timezone.name;
    } else {
        throw new Error('Timezone information not available');
    }
}

// Function to get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const timezone = await fetchTimezone(lat, lon);
                document.getElementById('current-timezone-info').innerText = timezone;
            } catch (error) {
                document.getElementById('current-timezone-info').innerText = 'Error fetching timezone';
            }
        }, () => {
            document.getElementById('current-timezone-info').innerText = 'Geolocation is not supported by this browser.';
        });
    } else {
        document.getElementById('current-timezone-info').innerText = 'Geolocation is not supported by this browser.';
    }
}

// Function to fetch latitude and longitude based on address
async function fetchCoordinates(address) {
    const apiKey = 'YOUR_GEOAPIFY_API_KEY';
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        return { lat, lon };
    } else {
        throw new Error('Address not found');
    }
}

// Event listener for the button click
document.getElementById('get-timezone-btn').addEventListener('click', async () => {
    const address = document.getElementById('address-input').value;
    if (address.trim() === '') {
        document.getElementById('address-timezone-info').innerText = 'Please enter a valid address.';
        return;
    }

    try {
        const { lat, lon } = await fetchCoordinates(address);
        const timezone = await fetchTimezone(lat, lon);
        document.getElementById('address-timezone-info').innerText = timezone;
    } catch (error) {
        document.getElementById('address-timezone-info').innerText = 'Error fetching timezone for the given address';
    }
});

// Initialize the page by getting the current location's timezone
getCurrentLocation();
