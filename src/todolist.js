const toDoForm = document.querySelector(".js-todo-form"),
    toDoInput = toDoForm.querySelector("input"),
    toDoList = document.querySelector(".js-todo-list");

const TODOS_LS = "toDos";
const BUTTON_STYLE = "todo-list-btn";
let toDos = [];

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function (toDo) {
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
}

function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function paintToDo(text) {
    const li = document.createElement("li");
    const textSpan = document.createElement("span");
    textSpan.innerHTML = text;
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
    deleteBtn.className = BUTTON_STYLE;
    deleteBtn.addEventListener("click", deleteToDo);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    toDoList.appendChild(li);
    const newId = toDos.length + 1;
    li.id = newId;
    const toDoObj = {
        text: text,
        id: newId
    };
    toDos.push(toDoObj);
    saveToDos();
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = "";
}

function loadToDos() {
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if (loadedToDos !== null) {
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function (toDo) {
            paintToDo(toDo.text);
        });
    }
}

function init() {
    loadToDos();
    toDoForm.addEventListener("submit", handleSubmit);
}

init();