import {Injectable} from 'angular2/angular2';

var store = new Map<string, Array<Todo>>();
var todoId = 0;

export class Todo {
	selected: Boolean = false;
	completed: Boolean = false;
	editing: Boolean = false;
	title: String;
	uid: String;
	setTitle(title: String) {
		this.title = title.trim();
	}
	constructor(title: String, completed: boolean = false) {
		this.uid = "todo " + (++todoId);
		this.title = title.trim();
        this.completed = completed;
	}
}

@Injectable()
export class TodoStore {
	todos: Array<Todo>;
	constructor() {
		this.todos = store.get('angular2-todos') || [];
	}
	_updateStore() {
		store.set('angular2-todos', this.todos);
	}
	get(state: {completed: Boolean}) {
		return this.todos.filter((todo: Todo) => todo.completed === state.completed);
	}
    private resetAll() {
        this.todos.forEach((t) => {
            t.selected = false
            t.editing = false
        });
    }
    select(todo: Todo, selected: Boolean) {
        this.resetAll();

        todo.selected = selected;
		this._updateStore();
    }
	toggleCompletion(todo: Todo) {
        todo.completed = !todo.completed;
		this._updateStore();
	}
	remove(todo: Todo) {
        this.resetAll();

        this.todos.splice(this.todos.indexOf(todo), 1);
		this._updateStore();
	}
    startEditing(todo: Todo) {
        this.resetAll();

        todo.editing = true;
    }
    finishEditing(todo: Todo, newTitle: string) {
        this.resetAll();

        todo.title = newTitle;
        todo.editing = false;
    }
	add(title: String, completed: boolean = false) {
        this.resetAll();

		this.todos.push(new Todo(title, completed));
		this._updateStore();
	}
}
