const API_KEY = "2c73831f9d55bad976af740f81425f0f";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

// Elements for displaying weather data
const locationEl = document.getElementById('location');
const conditionEl = document.getElementById('condition');
const tempCEl = document.getElementById('tempC');
const tempFEl = document.getElementById('tempF');
const humidityEl = document.getElementById('humidity');

// Function to build the weather API URL
function buildWeatherUrl(city) {
    const encodedCity = encodeURIComponent(city);
    return `${API_BASE_URL}?q=${encodedCity}&units=metric&appid=${API_KEY}`;
}

// Function to fetch weather data
async function fetchWeather(city) {
    if (!city || city.trim() === '') {
        showError('City cannot be empty. Please enter a city name.');
        return;
    }

    const url = buildWeatherUrl(city.trim());
    
    // Show loading, hide weather card and error
    loading.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    errorMessage.textContent = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message || `Request failed. HTTP status: ${response.status}`);
        }

        // Parse the weather data
        const weatherData = {
            cityName: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            tempF: Math.round((data.main.temp * 9/5) + 32), // Fixed conversion formula
            description: data.weather[0].description,
            humidity: data.main.humidity
        };

        // Display the weather data
        displayWeather(weatherData);

    } catch (error) {
        showError(`Something went wrong: ${error.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

// Function to display weather data
function displayWeather(data) {
    locationEl.textContent = `${data.cityName}, ${data.country}`;
    conditionEl.textContent = data.description;
    tempCEl.textContent = data.temp;
    tempFEl.textContent = data.tempF;
    humidityEl.textContent = `${data.humidity}%`;

    weatherCard.classList.remove('hidden');
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    weatherCard.classList.add('hidden');
}

// Event listeners
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

// Focus on input when page loads
window.addEventListener('load', () => {
    cityInput.focus();
});

