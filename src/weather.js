
const API_KEY = 'c88aad295eac02d3d5edc1cf35f07d2d'
const COORDS = 'coords';
const weatherSpan = document.querySelector('.js-weather')

function fetchAPI(url) {
    return fetch(url).then(function (response) {
        return response.json()
    })
}
// function getPlaceSearch(cityName) {
//     const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${GOOGLE_API_KEY}&input=${cityName}&inputtype=textquery`
//     fetchAPI(url).then(function (json) {
//         if (json.status === 'OK') {
//             getPlaceDetail(json.candidates[0].place_id)
//         }
//     })
// }
// function getPlaceDetail(place_id) {
//     const url = `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_API_KEY}&place_id=${place_id}`
//     fetchAPI(url).then(function (json) {
//         if (json.status === 'OK') {
//             getPlaceDetail(json.result.photos[0].photo_reference)
//         }
//     })
// }
// function getPlacePhotos(photo_reference) {
//     const url = `https://maps.googleapis.com/maps/api/place/photo?key=${GOOGLE_API_KEY}&photoreference=${photo_reference}&maxwidth=1960`
//     fetchAPI(url).then(function (json) {
//         console.log(json)
//     })
// }

function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetchAPI(url).then(function (json) {
        const { weather, main, name } = json;
        const temperature = main.temp;
        // DISPLAY WEATHER INFO
        weatherSpan.innerText = `${name} CITY, ${temperature} ${weather.length > 0 ? weather[0].main : ''}`;

        // GET CITY IMAGES
        getPlaceSearch(name);
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
    }
}

function init() {
    loadCoords()
}

init();