
const API_KEY = 'c88aad295eac02d3d5edc1cf35f07d2d'
const COORDS = 'coords';
const weather = document.querySelector('.js-weather')

function getWeather(lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetch(url).then(function (response) {
        return response.json()
    }).then(function (json) {
        const temperature = json.main.temp;
        const place = json.name;
        weather.innerText = `${temperature} @ ${place}`;
    });
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
    }
}

function init() {
    loadCoords()
}

init();