"use strict";
// TODO (ironic):
// display TODOS in a nice way. make a method that takes care of the undefined strings etc...
// when clicking on add project, open up a window where you can input stuff, submit it and make a new project
// -> same for todos, i can use the same window
// option to change the todo status for example...
var Priorities;
(function (Priorities) {
    Priorities[Priorities["High"] = 0] = "High";
    Priorities[Priorities["Medium"] = 1] = "Medium";
    Priorities[Priorities["Low"] = 2] = "Low";
})(Priorities || (Priorities = {}));
class Project {
    constructor(title) {
        this.todos = [];
        this.projectTitle = title;
        Project.instances.push(this);
    }
    addTodo(todo) {
        todo.project = this;
        this.todos.push(todo);
    }
}
Project.instances = [];
class Todo {
    constructor(title, priority, project, description) {
        this.todoTitle = title;
        this.priority = priority;
        this.creationDate = new Date();
        this.status = false;
        this.project = project !== null && project !== void 0 ? project : defaultProject;
        this.description = description;
    }
}
// ========================================
// Test Daten
let defaultProject = new Project("Default");
let projectMonday = new Project("Montag");
let projectTuesday = new Project("Dienstag");
let testTodo = new Todo("Todooo", Priorities.High, projectMonday);
let testTodo2 = new Todo("Todooo2", Priorities.Medium);
let testTodo4 = new Todo("überleben", Priorities.Medium, projectMonday);
let testTodo3 = new Todo("Gassi gehen xD", Priorities.High, projectTuesday);
// ========================================
// DOM Tempering
const projects = document.getElementById("projects");
const todos = document.getElementById("todos");
function renderProjects() {
    projects.innerHTML = "";
    for (const project of Project.instances) {
        const projectDiv = document.createElement("span");
        projectDiv.classList = "m-1";
        projectDiv.onclick = (event) => {
            showTodos(project);
        };
        projectDiv.textContent = project.projectTitle;
        projects === null || projects === void 0 ? void 0 : projects.appendChild(projectDiv);
        //  + todo.description + todo.priority + todo.project + todo.creationDate
    }
}
function addProject() {
    let newProject = prompt("Give your project a name", "Project XZ");
    if (newProject != null) {
        new Project(newProject);
        renderProjects();
    }
}
function addTodo() {
    let todoForm = document.getElementById("todo-form");
    let projectList = document.getElementById("project-dropdown");
    projectList.innerHTML = "";
    for (const project of Project.instances) {
        let projectElement = document.createElement("option");
        projectElement.value = project.projectTitle;
        projectElement.textContent = project.projectTitle;
        projectList.appendChild(projectElement);
    }
    todoForm.classList.replace("invisible", "visible");
}
function submitTodo() {
    saveTodo();
    const todoForm = document.getElementById("todo-form");
    todoForm.classList.replace("visible", "invisible");
    console.log("Submitted!");
}
function saveTodo() {
    const todoProjectTitle = document.getElementById("project-dropdown").value;
    const todoPriorityStr = document.getElementById("priority-dropdown").value;
    const todoTitle = document.getElementById("todo-title").value;
    const todoDescription = document.getElementById("todo-desc").value;
    const priorityEnum = Priorities[todoPriorityStr];
    const project = Project.instances.find((p) => p.projectTitle === todoProjectTitle);
    const newTodo = new Todo(todoTitle.trim(), priorityEnum, project, todoDescription.trim());
    project.addTodo(newTodo);
    showTodos(project);
    console.log("New Todo:", newTodo);
}
function cancelTodo() {
    let todoForm = document.getElementById("todo-form");
    todoForm.classList.replace("visible", "invisible");
    console.log("Cancelled");
}
function showAllTodos() {
    todos.innerHTML = "";
    for (const project of Project.instances) {
        for (const todo of project.todos) {
            displayTodo(todo);
        }
    }
}
function showTodos(selectedProject) {
    todos.innerHTML = "";
    for (const todo of selectedProject.todos) {
        displayTodo(todo);
    }
}
function displayTodo(todo) {
    var _a;
    const todoDiv = document.createElement("div");
    const singleTodo = document.createElement("p");
    singleTodo.textContent =
        todo.todoTitle + ((_a = todo.description) !== null && _a !== void 0 ? _a : "") + "Priority: " + Priorities[todo.priority];
    todos === null || todos === void 0 ? void 0 : todos.appendChild(singleTodo);
}
document.getElementById("submit-button").addEventListener("click", submitTodo);
document.getElementById("cancel-button").addEventListener("click", cancelTodo);
renderProjects();
showAllTodos();
//# sourceMappingURL=main.js.map