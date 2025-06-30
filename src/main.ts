// TODO (ironic):
// [x] be able to click on todos and update / edit them :/
// [x] deleting is possible too now, lit
// [] projekte perma erstellen...
// when editing, it shows the correct project (Dienstag) but the edited todo isnt part of it?
// I fixed it with using checkStorage() inside SaveEditedTodo but eh
// option to change the todo status for example...

enum Priorities {
    High = "High",
    Medium = "Medium",
    Low = "Low",
}

class Project {
    /**
     * Holds an array of todos and has a name
     * @param projectTitle [NEEDED!] - The title of the project
     * @param todos [automatic] - an array of all todos that belong to the project
     * @param instances [automatic] - to keep track of all projects so I can loop through it
     */
    projectTitle: string;
    static instances: Project[] = [];
    todos: Todo[] = [];

    public constructor(title: string) {
        this.projectTitle = title;
        Project.instances.push(this);
    }

    addTodo(todo: Todo) {
        this.todos.push(todo);
    }
}

class Todo {
    /**
     * @param id [automatic] - to make updating / deleting todos easier
     * @param todoTitle [NEEDED!] - The title of the todo
     * @param todoDescription [optional] - the description
     * @param creationDate [automatic] - the date the todo has been created
     * @param creationDate [NEEDED!] - the date the todo has been created
     * @param project [automatic] - to which project the todo belongs to
     * @param status [automatic] - false by default, asks if the task is done or not
     */
    static currentId = 1;
    id: number;
    todoTitle: string;
    description?: string;
    creationDate: Date;
    priority: Priorities;
    project: string;
    status: boolean;

    public constructor(title: string, priority: Priorities, project: string, description?: string) {
        this.id = Todo.currentId++;
        this.todoTitle = title;
        this.priority = priority;
        this.creationDate = new Date();
        this.status = false;
        this.description = description;
        this.project = project ?? defaultProject.projectTitle;
    }
}

// ========================================
// Test Daten

let defaultProject = new Project("Default");
let projectMonday = new Project("Montag");
let projectTuesday = new Project("Dienstag");

// ========================================
// DOM Tempering

const projects = document.getElementById("projects");
const todos = document.getElementById("todos");

function renderProjects() {
    projects!.innerHTML = "";
    for (const project of Project.instances) {
        const projectDiv = document.createElement("span");
        projectDiv.classList = "m-1";
        projectDiv.onclick = (event) => {
            showTodos(project);
        };
        projectDiv.textContent = project.projectTitle;
        projects?.appendChild(projectDiv);
    }
}

function getTodo(i: number) {
    let key = localStorage.key(i);
    let todo = localStorage.getItem(key!);
    let todoParsed = JSON.parse(todo!);
    return todoParsed as Todo;
}

function checkStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let todo = getTodo(i);
        for (const project of Project.instances) {
            if (project.projectTitle == todo.project) {
                project.addTodo(todo);
            }
        }
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
    const submitBtn = document.getElementById("submit-button")!;
    const editBtn = document.getElementById("edit-button")!;
    const deleteBtn = document.getElementById("delete-button")!;

    submitBtn.classList.remove("hidden");
    editBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    projectList!.innerHTML = "";

    for (const project of Project.instances) {
        let projectElement = document.createElement("option");
        projectElement.value = project.projectTitle;
        projectElement.textContent = project.projectTitle;
        projectList!.appendChild(projectElement);
    }

    (document.getElementById("todo-title") as HTMLInputElement).value = "";
    (document.getElementById("todo-desc") as HTMLInputElement).value = "";
    (document.getElementById("priority-dropdown") as HTMLSelectElement).value = Priorities.Low;
    todoForm!.classList.replace("invisible", "visible");
}

let currentTodo: Todo | null = null;
function editTodo(todo: Todo) {
    currentTodo = todo;
    let todoForm = document.getElementById("todo-form");
    let todoTitle = document.getElementById("todo-title") as HTMLInputElement;
    let todoDesc = document.getElementById("todo-desc") as HTMLInputElement;
    let priorityList = document.getElementById("priority-dropdown") as HTMLSelectElement;
    let projectList = document.getElementById("project-dropdown");
    const submitBtn = document.getElementById("submit-button")!;
    const editBtn = document.getElementById("edit-button")!;
    const deleteBtn = document.getElementById("delete-button")!;

    submitBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    projectList!.innerHTML = "";

    todoTitle.value = todo.todoTitle;
    todoDesc.value = todo.description ? todo.description : "";
    priorityList!.value = todo.priority;

    for (const project of Project.instances) {
        let projectElement = document.createElement("option");
        projectElement.value = project.projectTitle;
        projectElement.textContent = project.projectTitle;
        if (todo.project == project.projectTitle) projectElement.selected = true;
        projectList!.appendChild(projectElement);
    }
    todoForm!.classList.replace("invisible", "visible");
}

function saveNewTodo() {
    const todoForm = document.getElementById("todo-form");
    const todoProjectTitle = (document.getElementById("project-dropdown") as HTMLSelectElement)
        .value;
    const todoPriorityStr = (document.getElementById("priority-dropdown") as HTMLSelectElement)
        .value;
    const todoTitle = (document.getElementById("todo-title") as HTMLInputElement).value;
    const todoDescription = (document.getElementById("todo-desc") as HTMLInputElement).value;

    const priorityEnum = Priorities[todoPriorityStr as keyof typeof Priorities];
    const project = Project.instances.find((p) => p.projectTitle === todoProjectTitle);
    const projectName = project?.projectTitle;
    const newTodo = new Todo(todoTitle, priorityEnum, projectName!, todoDescription);
    project!.addTodo(newTodo);

    localStorage.setItem(String(newTodo.id), JSON.stringify(newTodo));
    showTodos(project as Project);
    todoForm!.classList.replace("visible", "invisible");
}

function saveEditedTodo(todo: Todo) {
    const todoForm = document.getElementById("todo-form");
    const todoProjectTitle = (document.getElementById("project-dropdown") as HTMLSelectElement)
        .value;
    const todoPriorityStr = (document.getElementById("priority-dropdown") as HTMLSelectElement)
        .value;
    const todoTitle = (document.getElementById("todo-title") as HTMLInputElement).value;
    const todoDescription = (document.getElementById("todo-desc") as HTMLInputElement).value;

    const priorityEnum = Priorities[todoPriorityStr as keyof typeof Priorities];
    const project = Project.instances.find((p) => p.projectTitle === todoProjectTitle);
    const projectName = project?.projectTitle;

    todo.todoTitle = todoTitle;
    todo.description = todoDescription;
    todo.priority = priorityEnum;
    todo.project = projectName as string;
    localStorage.setItem(String(todo.id), JSON.stringify(todo));
    checkStorage();
    showTodos(project as Project);
    todoForm!.classList.replace("visible", "invisible");
    currentTodo = null;
}

function deleteTodo(todo: Todo) {
    localStorage.removeItem(String(todo.id));
    checkStorage();
    showAllTodos();
}

function cancelTodo() {
    let todoForm = document.getElementById("todo-form");
    todoForm!.classList.replace("visible", "invisible");
    currentTodo = null;
}

function showAllTodos() {
    todos!.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let todo = getTodo(i);
        displayTodo(todo);
    }
}

function showTodos(selectedProject: Project) {
    todos!.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {
        let todo = getTodo(i);
        for (let j = 0; j < selectedProject.todos.length; j++) {
            if (selectedProject.todos[j].todoTitle == todo.todoTitle) {
                displayTodo(todo);
            }
        }
    }
}

function displayTodo(todo: Todo) {
    const todoDiv = document.createElement("div");
    todoDiv.onclick = (event) => {
        editTodo(todo);
    };
    todoDiv.innerHTML = `<p>Title: ${todo.todoTitle}</p>
    <p>Description: ${todo.description ?? ""}</p>
    <p>Priority: ${Priorities[todo.priority]}</p>
    `;
    todos?.appendChild(todoDiv);
}
// break in case of emergency:
// localStorage.clear();
document.getElementById("submit-button")!.addEventListener("click", saveNewTodo);
document.getElementById("edit-button")!.addEventListener("click", () => {
    if (currentTodo) saveEditedTodo(currentTodo);
});
document.getElementById("cancel-button")!.addEventListener("click", cancelTodo);
document.getElementById("delete-button")!.addEventListener("click", () => {
    if (currentTodo) deleteTodo(currentTodo);
});
renderProjects();
checkStorage();
showAllTodos();
