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
        (this.project = project !== null && project !== void 0 ? project : defaultProject).addTodo(this);
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
    const todoDiv = document.createElement("div");
    const singleTodo = document.createElement("p");
    todoDiv.classList = "border border-red";
    singleTodo.classList = "border border-white";
    singleTodo.textContent = todo.todoTitle + todo.description + todo.priority;
    todos === null || todos === void 0 ? void 0 : todos.appendChild(singleTodo);
}
showAllTodos();
//# sourceMappingURL=main.js.map