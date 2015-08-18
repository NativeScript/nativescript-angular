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
    <Label text='Hello, Angularrrr!' cssClass='title complete'></Label>
    <StackLayout orientation='vertical'>
        <StackLayout
            *ng-for="#todo of todoStore.todos"
            orientation='horizontal'
            [class.complete]="todo.completed" [class.incomplete]="!todo.completed" [class.editing]="todo.editing"
            >
            <Switch [checked]="todo.completed" (tap)="toggleCompletion(todo, checked)"></Switch>
            <Label [text]="todo.title"></Label>
        </StackLayout>
    </StackLayout>
    <Button text='Add' (tap)='onAdd($event)'></Button>
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

    onAdd(eventData) {
        this.todoStore.add("fafla", false); 
    }

    toggleCompletion(todo: Todo, checked: boolean) {
        console.log('toggleCompletion: ' + todo.completed);
        if (todo.completed !== undefined) {
            setTimeout(() => todo.completed = !todo.completed, 0);
        }
        //setTimeout(() => todo.completed = checked, 0);
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
