export class Project {
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
//# sourceMappingURL=project.js.map