"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
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
exports.Todo = Todo;
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
//# sourceMappingURL=todo.js.map