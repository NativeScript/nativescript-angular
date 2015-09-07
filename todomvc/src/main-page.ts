import 'reflect-metadata';
import {TextView} from 'ui/text-view';
import {topmost} from 'ui/frame';
import {nativeScriptBootstrap} from 'nativescript-angular/application';
import {Inject, Component, View, NgIf, NgFor} from 'angular2/angular2';
import {TodoStore, Todo} from './services/store';

@Component({
	selector: 'main',
	hostAttributes: {
	}
})
@View({
    directives: [NgIf, NgFor],
	template: `
<StackLayout orientation='vertical'>
    <Label text='ng-todo' class='title complete'></Label>
    <StackLayout orientation='vertical'>
        <StackLayout
            *ng-for="#todo of todoStore.todos"
            class="todo-item"
            (tap)="toggleSelected(todo)"
            (doubleTap)="edit(todo)"
            >
                <DockLayout *ng-if="!todo.editing" stretchLastChild="true">
                    <Button
                        width="50px"
                        text="[X]"
                        (tap)="toggleCompletion(todo)"
                        dock="left"></Button>
                    <Label
                        [class.complete]="todo.completed"
                        [class.incomplete]="!todo.completed"
                        class="todo-text"
                        verticalAlignment="center"
                        minWidth="200"
                        [text]="todo.title"
                        *ng-if="!todo.editing"
                        dock="right"></Label>
                </DockLayout>
                <DockLayout *ng-if="todo.editing" stretchLastChild="true">
                    <TextField
                        #title
                        class="todo-input"
                        verticalAlignment="center"
                        minWidth="200"
                        [text]="todo.title"
                        dock="left"></TextField>
                    <Button text="Done"
                        (tap)="finishEditing(todo, title.text)"
                        dock="right"></Button>
                </DockLayout>
                <StackLayout orientation="horizontal" *ng-if="todo.selected && !todo.editing">
                    <Button [text]="!todo.completed ? 'Complete!' : 'Undo complete'" (tap)="toggleCompletion(todo)"></Button>
                    <Button text="Edit" (tap)="edit(todo)"></Button>
                    <Button text="Delete" (tap)="delete(todo)"></Button>
                </StackLayout>
        </StackLayout>
    </StackLayout>
    <Button class="add-button" text='Add' (tap)='addNew($event)'></Button>
</StackLayout>
`,
})
class MainPage {
	todoStore: TodoStore;

	constructor() {
		this.todoStore = new TodoStore();
        this.todoStore.add("item 1", true);
        this.todoStore.add("item 2", false);
	}

    addNew(eventData) {
        this.todoStore.add("fafla", false); 
    }

    toggleSelected(todo: Todo) {
        console.log('Selecting: ' + todo.title);
        this.todoStore.select(todo, !todo.selected);
    }

    toggleCompletion(todo: Todo) {
        console.log('toggleCompletion: ' + todo.completed);
        this.todoStore.toggleCompletion(todo);
    }

    delete(todo: Todo) {
        this.todoStore.remove(todo);
    }

    edit(todo: Todo) {
        this.todoStore.startEditing(todo);
    }

    finishEditing(todo: Todo, newTitle: string) {
        this.todoStore.finishEditing(todo, newTitle);
    }
}

export function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = "";

    console.log('BOOTSTRAPPING...');
    nativeScriptBootstrap(MainPage, []).then((appRef) => {
        console.log('ANGULAR BOOTSTRAP DONE.');
    }, (err) =>{
        console.log('ERROR BOOTSTRAPPING ANGULAR');
        let errorMessage = err.message + "\n\n" + err.stack;
        console.log(errorMessage);

        let view = new TextView();
        view.text = errorMessage;
        topmost().currentPage.content = view;
    });
}
