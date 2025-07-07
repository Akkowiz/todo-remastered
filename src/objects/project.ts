import { Todo } from "./todo";

export class Project {
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
