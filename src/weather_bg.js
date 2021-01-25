
const API_KEY = 'c88aad295eac02d3d5edc1cf35f07d2d'
const COORDS = 'coords';

const weatherBox = document.querySelector('.js-weather-box'),
    weatherMainSpan = weatherBox.querySelector('.js-weather-main'),
    weatherSpan = weatherBox.querySelector('.js-weather'),
    pm25Span = weatherBox.querySelector('.js-pm25'),
    pm10Span = weatherBox.querySelector('.js-pm10'),
    image = document.querySelector(".bgImage");

const IMG_NUMBER = 3, WEATHER_NUMBER = 7;

const WEATERS = ['Clear', 'Clouds', 'Drizzle', "Fog", 'Rain', 'Snow', 'Thunderstorm'],
    POLLUTIONS = ['GOOD', "NOT BAD", "BAD", "WORST"],
    COLORS = ['blue', 'green', 'orange', 'red'],
    SHOWING = 'showing-weather'

// SET RANDOM BACKGROUND IMAGE BASED ON WEATHER INFO
function paintImage(weather, imgNumber) {
    image.src = `assets/images/${weather}-${imgNumber + 1}.jpg`;
    image.classList.add("bgImage");
}

function genRandom(NUMBER) {
    const number = Math.floor(Math.random() * NUMBER);
    return number;
}

function fetchAPI(url) {
    return fetch(url).then(function (response) {
        return response.json()
    })
}

// AIR POLLUTION API
function setPM2_5_Status(pm2_5) {
    let index = 0;
    switch (true) {
        case pm2_5 < 16:
            index = 0;
            break;
        case pm2_5 < 36:
            index = 1;
            break;
        case pm2_5 < 76:
            index = 2;
            break;
        default:
            index = 3;
            break;
    }
    pm25Span.innerHTML = POLLUTIONS[index]
    pm25Span.style.color = COLORS[index];
}
function setPM10_Status(pm10) {
    let index = 0;
    switch (true) {
        case pm10 < 31:
            index = 0;
            break;
        case pm10 < 81:
            index = 1;
            break;
        case pm10 < 151:
            index = 2;
            break;
        default:
            index = 3;
            break;
    }
    pm10Span.innerHTML = POLLUTIONS[index]
    pm10Span.style.color = COLORS[index];
}

function getAirPollution(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    fetchAPI(url).then(function (json) {
        const list = json.list;
        if (list.length > 0) {
            const { pm2_5, pm10 } = list[0].components;
            setPM2_5_Status(pm2_5);
            setPM10_Status(pm10);
        }
    })
}

// WEATHER API
function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetchAPI(url).then(function (json) {
        const { weather, main, name } = json;
        const temperature = main.temp;
        // DISPLAY WEATHER INFO
        weatherBox.classList.add(SHOWING)
        // WEATHER ICON
        const icon = new Image();
        icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        icon.classList.add('icon')
        weatherBox.appendChild(icon);

        // WEATHER INFO TEXT
        weatherMainSpan.innerText = weather[0].main
        weatherSpan.innerText = `${name}, ${temperature} °C`;

        // SET RANDOM BACKGROUND IMAGE BASED ON THE WEATHER
        const randomNumber = genRandom(IMG_NUMBER);
        const weatherName = Math.floor(weather[0].id / 100) !== 7 ? weather[0].main : 'Fog';
        paintImage(weatherName, randomNumber);
    })
}


function handleGeoSuccess(position) {
    const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    saveCoords(coords)
    getWeather(coords.latitude, coords.longitude);
    getAirPollution(coords.latitude, coords.longitude);
}

function handleGeoError(position) {
    alert('Cant access geo location');
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError)
}

function saveCoords(coords) {
    localStorage.setItem(COORDS, JSON.stringify(coords))

}
function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if (loadedCoords === null) {
        image.src = `assets/images/${WEATERS[genRandom(WEATHER_NUMBER)]}-${genRandom(IMG_NUMBER)}.jpg`;
        askForCoords();
    } else {
        const { latitude, longitude } = JSON.parse(loadedCoords);
        getWeather(latitude, longitude);
        getAirPollution(latitude, longitude);
    }
}

function init() {
    loadCoords()
}

init();