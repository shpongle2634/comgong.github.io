
const clockContainer = document.querySelector(".js-clock-container"),
    hoursSpan = clockContainer.querySelector(".js-hours"),
    minSpan = clockContainer.querySelector(".js-min"),
    secSpan = clockContainer.querySelector(".js-sec"),
    blinksSpan = clockContainer.querySelectorAll('.js-blink');
const BLINK_STYLE = 'blink';

function getTime() {
    const date = new Date();
    const min = date.getMinutes();
    const hours = date.getHours();
    const sec = date.getSeconds();

    hoursSpan.innerText = `${hours < 10 ? `0${hours}` : hours}`
    minSpan.innerText = `${min < 10 ? `0${min}` : min}`
    secSpan.innerText = `${sec < 10 ? `0${sec}` : sec}`;
    blinksSpan.forEach(function (blink) {
        blink.classList.toggle(BLINK_STYLE)
    })
}

function init() {
    getTime();
    setInterval(getTime, 1000);
}

init();