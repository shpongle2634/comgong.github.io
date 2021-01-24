const form = document.querySelector(".js-name-form"),
    input = form.querySelector("input"),
    greeting = document.querySelector(".js-greetings");
const logout = document.querySelector('.js-logout')
const USER_LS = "currentUser",
    SHOWING_CN = "showing";

function saveName(text) {
    localStorage.setItem(USER_LS, text);
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = input.value;
    paintGreeting(currentValue);
    saveName(currentValue);
}

function askForName() {
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit", handleSubmit);
}

function paintGreeting(text) {
    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);
    greeting.innerText = `Hello " ${text} " !`;
    logout.addEventListener('click', clearName)
    logout.classList.add(SHOWING_CN);
}

function clearName() {
    localStorage.removeItem(USER_LS);
    logout.classList.remove(SHOWING_CN);
    greeting.classList.remove(SHOWING_CN);
    input.value = ""
    askForName();
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if (currentUser === null) {
        askForName();
    } else {
        paintGreeting(currentUser);
    }
}


function init() {
    loadName();
}

init();