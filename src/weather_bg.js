
const API_KEY = 'c88aad295eac02d3d5edc1cf35f07d2d'
const COORDS = 'coords';
const weatherBox = document.querySelector('.js-weather-box')
const weatherMainSpan = weatherBox.querySelector('.js-weather-main')
const weatherSpan = weatherBox.querySelector('.js-weather')
const pm25Span = weatherBox.querySelector('.js-pm25')
const pm10Span = weatherBox.querySelector('.js-pm10')

const body = document.querySelector("body");
const IMG_NUMBER = 3;

const POLLUTIONS = ['GOOD', "NOT BAD", "BAD", "WORST"];
const COLORS = ['blue', 'green', 'orange', 'red'];

// SET RANDOM BACKGROUND IMAGE BASED ON WEATHER INFO
function paintImage(weather, imgNumber) {
    const image = new Image();
    image.src = `assets/images/${weather}-${imgNumber + 1}.jpg`;
    image.classList.add("bgImage");
    body.prepend(image);
}

function genRandom() {
    const number = Math.floor(Math.random() * IMG_NUMBER);
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
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
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
        const icon = new Image();
        icon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        icon.classList.add('icon')
        weatherBox.appendChild(icon);
        weatherMainSpan.innerText = weather[0].main
        weatherSpan.innerText = `${name}, ${temperature} °C`;

        // SET RANDOM BACKGROUND IMAGE RELATED WEATHER
        const randomNumber = genRandom();
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
}

function handleGeoError(position) {
    console.log('Cant access geo location')
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