"use strict";
// ========================================
// Classes, Enums
// ========================================
var Priorities;
(function (Priorities) {
    Priorities["High"] = "High";
    Priorities["Medium"] = "Medium";
    Priorities["Low"] = "Low";
})(Priorities || (Priorities = {}));
class Project {
    constructor(title) {
        this.todos = [];
        this.id = Project.currentId++;
        this.projectTitle = title;
        Project.instances.push(this);
    }
    addTodo(todo) {
        this.todos.push(todo);
    }
}
Project.currentId = 100000;
Project.instances = [];
class Todo {
    constructor(title, priority, project, description) {
        this.id = Todo.currentId++;
        this.todoTitle = title;
        this.priority = priority;
        this.creationDate = new Date();
        this.status = false;
        this.description = description;
        this.project = project !== null && project !== void 0 ? project : defaultProject.projectTitle;
    }
}
/**
 * @param id [automatic] - to make updating / deleting todos easier
 * @param todoTitle [NEEDED!] - The title of the todo
 * @param todoDescription [optional] - the description
 * @param creationDate [automatic] - the date the todo has been created
 * @param creationDate [NEEDED!] - the date the todo has been created
 * @param project [automatic] - to which project the todo belongs to
 * @param status [automatic] - false by default, asks if the task is done or not
 */
Todo.currentId = 1;
// ========================================
// Test Daten
// ========================================
let defaultProject = new Project("Default");
defaultProject.id = 100000;
localStorage.setItem(defaultProject.projectTitle, JSON.stringify(defaultProject));
// ========================================
// DOM Tempering
// ========================================
const projects = document.getElementById("projects");
const todos = document.getElementById("todos");
// ========================================
// THE VISION
// ========================================
function renderProjects() {
    projects.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let project = getElement(i);
        if (isProject(project)) {
            displayProject(project);
        }
    }
    for (const project of Project.instances) {
    }
}
function showAllTodos() {
    todos.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let todo = getElement(i);
        if (isTodo(todo)) {
            displayTodo(todo);
        }
    }
}
function showTodos(selectedProject) {
    todos.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let todo = getElement(i);
        if (isTodo(todo) && todo.project == selectedProject.projectTitle) {
            displayTodo(todo);
        }
    }
}
function getElement(i) {
    let key = localStorage.key(i);
    let element = localStorage.getItem(key);
    let elementParsed = JSON.parse(element);
    if (elementParsed.id >= 100000) {
        return elementParsed;
    }
    else {
        return elementParsed;
    }
}
function isTodo(obj) {
    return obj && typeof obj === "object" && "todoTitle" in obj;
}
function isProject(obj) {
    return obj && typeof obj === "object" && "projectTitle" in obj;
}
function checkStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let project = getElement(i);
        if (isProject(project)) {
            project = new Project(project.projectTitle);
            for (let i = 0; i < localStorage.length; i++) {
                let todo = getElement(i);
                if (isTodo(todo)) {
                    if (todo.project == project.projectTitle) {
                        todo = new Todo(todo.todoTitle, todo.priority, todo.project, todo.description);
                        project.addTodo(todo);
                    }
                }
            }
        }
    }
}
function addProject() {
    let newProject = prompt("Give your project a name", "Project XZ");
    if (newProject != null) {
        let addedProject = new Project(newProject);
        localStorage.setItem(String(addedProject.id), JSON.stringify(addedProject));
        renderProjects();
    }
}
function addTodo() {
    let todoForm = document.getElementById("todo-form");
    let projectList = document.getElementById("project-dropdown");
    const submitBtn = document.getElementById("submit-button");
    const editBtn = document.getElementById("edit-button");
    const deleteBtn = document.getElementById("delete-button");
    submitBtn.classList.remove("hidden");
    editBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    projectList.innerHTML = "";
    for (let project of Project.instances) {
        let projectElement = document.createElement("option");
        projectElement.value = project.projectTitle;
        projectElement.textContent = project.projectTitle;
        projectList.appendChild(projectElement);
    }
    document.getElementById("todo-title").value = "";
    document.getElementById("todo-desc").value = "";
    document.getElementById("priority-dropdown").value = Priorities.Low;
    todoForm.classList.replace("invisible", "visible");
}
let currentTodo = null;
function editTodo(todo) {
    currentTodo = todo;
    let todoForm = document.getElementById("todo-form");
    let todoTitle = document.getElementById("todo-title");
    let todoDesc = document.getElementById("todo-desc");
    let priorityList = document.getElementById("priority-dropdown");
    let projectList = document.getElementById("project-dropdown");
    const submitBtn = document.getElementById("submit-button");
    const editBtn = document.getElementById("edit-button");
    const deleteBtn = document.getElementById("delete-button");
    submitBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    projectList.innerHTML = "";
    todoTitle.value = todo.todoTitle;
    todoDesc.value = todo.description ? todo.description : "";
    priorityList.value = todo.priority;
    for (const project of Project.instances) {
        let projectElement = document.createElement("option");
        projectElement.value = project.projectTitle;
        projectElement.textContent = project.projectTitle;
        if (todo.project == project.projectTitle)
            projectElement.selected = true;
        projectList.appendChild(projectElement);
    }
    todoForm.classList.replace("invisible", "visible");
}
function saveNewTodo() {
    const todoForm = document.getElementById("todo-form");
    const todoProjectTitle = document.getElementById("project-dropdown")
        .value;
    const todoPriorityStr = document.getElementById("priority-dropdown")
        .value;
    const todoTitle = document.getElementById("todo-title").value;
    const todoDescription = document.getElementById("todo-desc").value;
    const priorityEnum = Priorities[todoPriorityStr];
    const project = Project.instances.find((p) => p.projectTitle === todoProjectTitle);
    const projectName = project === null || project === void 0 ? void 0 : project.projectTitle;
    const newTodo = new Todo(todoTitle, priorityEnum, projectName, todoDescription);
    project.addTodo(newTodo);
    console.log("project inside saveNewTodo:", project);
    localStorage.setItem(String(newTodo.id), JSON.stringify(newTodo));
    showTodos(project);
    todoForm.classList.replace("visible", "invisible");
}
function saveEditedTodo(todo) {
    const todoForm = document.getElementById("todo-form");
    const todoProjectTitle = document.getElementById("project-dropdown")
        .value;
    const todoPriorityStr = document.getElementById("priority-dropdown")
        .value;
    const todoTitle = document.getElementById("todo-title").value;
    const todoDescription = document.getElementById("todo-desc").value;
    const priorityEnum = Priorities[todoPriorityStr];
    const project = Project.instances.find((p) => p.projectTitle === todoProjectTitle);
    const projectName = project === null || project === void 0 ? void 0 : project.projectTitle;
    todo.todoTitle = todoTitle;
    todo.description = todoDescription;
    todo.priority = priorityEnum;
    todo.project = projectName;
    localStorage.setItem(String(todo.id), JSON.stringify(todo));
    checkStorage();
    showTodos(project);
    todoForm.classList.replace("visible", "invisible");
    currentTodo = null;
}
function deleteTodo(todo) {
    localStorage.removeItem(String(todo.id));
    checkStorage();
    showAllTodos();
}
function cancelTodo() {
    let todoForm = document.getElementById("todo-form");
    todoForm.classList.replace("visible", "invisible");
    currentTodo = null;
}
function displayProject(project) {
    const projectDiv = document.createElement("span");
    projectDiv.className = "m-1";
    projectDiv.onclick = (event) => {
        showTodos(project);
    };
    projectDiv.textContent = project.projectTitle;
    projects === null || projects === void 0 ? void 0 : projects.appendChild(projectDiv);
}
function displayTodo(todo) {
    var _a;
    const todoDiv = document.createElement("div");
    todoDiv.onclick = (event) => {
        editTodo(todo);
    };
    todoDiv.innerHTML = `<p>Title: ${todo.todoTitle}</p>
    <p>Description: ${(_a = todo.description) !== null && _a !== void 0 ? _a : ""}</p>
    <p>Priority: ${Priorities[todo.priority]}</p>
    `;
    todos === null || todos === void 0 ? void 0 : todos.appendChild(todoDiv);
}
// break in case of emergency:
// localStorage.clear();
document.getElementById("submit-button").addEventListener("click", saveNewTodo);
document.getElementById("edit-button").addEventListener("click", () => {
    if (currentTodo)
        saveEditedTodo(currentTodo);
});
document.getElementById("cancel-button").addEventListener("click", cancelTodo);
document.getElementById("delete-button").addEventListener("click", () => {
    if (currentTodo)
        deleteTodo(currentTodo);
});
checkStorage();
renderProjects();
showAllTodos();
//# sourceMappingURL=main.js.map