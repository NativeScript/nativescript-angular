import 'reflect-metadata';
import {TextView} from 'ui/text-view';
import {topmost} from 'ui/frame';
import {nativeScriptBootstrap} from 'nativescript-angular/application';
import {Inject, Component, View, NgIf, NgFor} from 'angular2/angular2';

@Component({
	selector: 'main',
	hostAttributes: {
	}
})
@View({
    directives: [NgIf, NgFor],
	template: `
<StackLayout orientation='vertical'>
    <Label text='Hello, Angular!' fontSize='20' verticalAlignment='center' padding='20'></Label>
</StackLayout>
`,
})
class MainPage {
    constructor() {
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
