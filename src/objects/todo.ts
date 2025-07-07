import { Priorities } from "./priority-enums";

export class Todo {
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
        this.project = project ?? "Default";
    }
}
