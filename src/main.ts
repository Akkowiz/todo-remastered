// ========================================
// Classes, Enums
// ========================================

enum Priorities {
    High = "High",
    Medium = "Medium",
    Low = "Low",
}

class Project {
    /**
     * Holds an array of todos, has a name and an ID
     * @param id [automatic] - for saving it easier in localstorage
     * @param projectTitle [NEEDED!] - The title of the project
     * @param todos [automatic] - an array of all todos that belong to the project
     * @param instances [automatic] - to keep track of all projects so I can loop through it
     */
    projectTitle: string;
    static currentId = 100000;
    static instances: Project[] = [];
    id: number;
    todos: Todo[] = [];

    public constructor(title: string) {
        this.id = Project.currentId++;
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
    projects!.innerHTML = "";
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
    todos!.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let todo = getElement(i);
        if (isTodo(todo)) {
            displayTodo(todo);
        }
    }
}

function showTodos(selectedProject: Project) {
    todos!.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let todo = getElement(i);
        if (isTodo(todo) && todo.project == selectedProject.projectTitle) {
            displayTodo(todo);
        }
    }
}

function getElement(i: number) {
    let key = localStorage.key(i);
    let element = localStorage.getItem(key!);
    let elementParsed = JSON.parse(element!);
    if (elementParsed.id >= 100000) {
        return elementParsed as Project;
    } else {
        return elementParsed as Todo;
    }
}

function isTodo(obj: any): obj is Todo {
    return obj && typeof obj === "object" && "todoTitle" in obj;
}

function isProject(obj: any): obj is Project {
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
                        todo = new Todo(
                            todo.todoTitle,
                            todo.priority,
                            todo.project,
                            todo.description
                        );
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
    const submitBtn = document.getElementById("submit-button")!;
    const editBtn = document.getElementById("edit-button")!;
    const deleteBtn = document.getElementById("delete-button")!;

    submitBtn.classList.remove("hidden");
    editBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    projectList!.innerHTML = "";

    for (let project of Project.instances) {
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
    console.log("project inside saveNewTodo:", project);

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

function displayProject(project: Project) {
    const projectDiv = document.createElement("span");
    projectDiv.className = "m-1";
    projectDiv.onclick = (event) => {
        showTodos(project);
    };
    projectDiv.textContent = project!.projectTitle;
    projects?.appendChild(projectDiv);
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

checkStorage();
renderProjects();
showAllTodos();
