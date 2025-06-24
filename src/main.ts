// TODO (ironic):
// display TODOS in a nice way. make a method that takes care of the undefined strings etc...
// when clicking on add project, open up a window where you can input stuff, submit it and make a new project
// -> same for todos, i can use the same window
// option to change the todo status for example...

enum Priorities {
    "High",
    "Medium",
    "Low",
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
        todo.project = this;
        this.todos.push(todo);
    }
}

class Todo {
    /**
     * @param todoTitle [NEEDED!] - The title of the todo
     * @param todoDescription [optional] - the description
     * @param creationDate [automatic] - the date the todo has been created
     * @param creationDate [NEEDED!] - the date the todo has been created
     * @param project [automatic] - to which project the todo belongs to
     * @param status [automatic] - false by default, asks if the task is done or not
     */
    todoTitle: string;
    description?: string;
    creationDate: Date;
    priority: Priorities;
    project: Project;
    status: boolean;

    public constructor(
        title: string,
        priority: Priorities,
        project?: Project,
        description?: string
    ) {
        this.todoTitle = title;
        this.priority = priority;
        this.creationDate = new Date();
        this.status = false;
        this.project = project ?? defaultProject;
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
    projects!.innerHTML = "";
    for (const project of Project.instances) {
        const projectDiv = document.createElement("span");
        projectDiv.classList = "m-1";
        projectDiv.onclick = (event) => {
            showTodos(project);
        };
        projectDiv.textContent = project.projectTitle;
        projects?.appendChild(projectDiv);
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
    projectList!.innerHTML = "";

    for (const project of Project.instances) {
        let projectElement = document.createElement("option");
        projectElement.value = project.projectTitle;
        projectElement.textContent = project.projectTitle;
        projectList!.appendChild(projectElement);
    }
    todoForm!.classList.replace("invisible", "visible");
}

function submitTodo() {
    saveTodo();
    const todoForm = document.getElementById("todo-form");
    todoForm!.classList.replace("visible", "invisible");
    console.log("Submitted!");
}

function saveTodo() {
    const todoProjectTitle = (document.getElementById("project-dropdown") as HTMLSelectElement).value;
    const todoPriorityStr = (document.getElementById("priority-dropdown") as HTMLSelectElement).value;
    const todoTitle = (document.getElementById("todo-title") as HTMLInputElement).value;
    const todoDescription = (document.getElementById("todo-desc") as HTMLInputElement).value;

    const priorityEnum = Priorities[todoPriorityStr as keyof typeof Priorities];
    const project = Project.instances.find((p) => p.projectTitle === todoProjectTitle);

    const newTodo = new Todo(todoTitle.trim(), priorityEnum, project, todoDescription.trim());
    project!.addTodo(newTodo);

    showTodos(project as Project);
    console.log("New Todo:", newTodo);
}

function cancelTodo() {
    let todoForm = document.getElementById("todo-form");
    todoForm!.classList.replace("visible", "invisible");
    console.log("Cancelled");
}

function showAllTodos() {
    todos!.innerHTML = "";
    for (const project of Project.instances) {
        for (const todo of project.todos) {
            displayTodo(todo);
        }
    }
}

function showTodos(selectedProject: Project) {
    todos!.innerHTML = "";
    for (const todo of selectedProject.todos) {
        displayTodo(todo);
    }
}

function displayTodo(todo: Todo) {
    const todoDiv = document.createElement("div");
    const singleTodo = document.createElement("p");
    singleTodo.textContent =
        todo.todoTitle + (todo.description ?? "") + "Priority: " + Priorities[todo.priority];
    todos?.appendChild(singleTodo);
}

document.getElementById("submit-button")!.addEventListener("click", submitTodo);
document.getElementById("cancel-button")!.addEventListener("click", cancelTodo);
renderProjects();
showAllTodos();
