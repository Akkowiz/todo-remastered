"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
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
exports.Project = Project;
Project.currentId = 100000;
Project.instances = [];
//# sourceMappingURL=project.js.map