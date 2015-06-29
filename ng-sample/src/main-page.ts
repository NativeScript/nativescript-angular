import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';

import 'reflect-metadata';
import {Component, View} from 'angular2/angular2';

import {nativeScriptBootstrap} from 'nativescript-angular/application';

@Component({
	selector: 'main-page',
	hostAttributes: {
	}
})
@View({
	template: `
<StackLayout orientation='vertical'>
    <Label text='Name' fontSize='32' verticalAlignment='center' padding='20'></Label>
    <TextField text='John' fontSize='32' padding='20'></TextField>
    <Button [text]='buttonText'></Button>
</StackLayout>
`,
	directives: []
})
class MainPage {
    public buttonText: string = "";

    constructor() {
        this.buttonText = 'Tap me, baby, one more time!'
    }
}

//TODO: move to an angular init module/base page class
export function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = "";

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
