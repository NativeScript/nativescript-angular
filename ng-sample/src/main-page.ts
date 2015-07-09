import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';

import 'reflect-metadata';
import {Component, View, NgIf} from 'angular2/angular2';

import {nativeScriptBootstrap} from 'nativescript-angular/application';

@Component({
	selector: 'main-page',
	hostAttributes: {
	}
})
@View({
    directives: [NgIf],
	template: `
<StackLayout orientation='vertical'>
    <Label text='Name' fontSize='32' verticalAlignment='center' padding='20'></Label>
    <TextField #name text='John' fontSize='32' padding='20'></TextField>
    <Button [text]='buttonText' (tap)='onSave($event, name.text)'></Button>
    <Button text='Toggle details' (tap)='onToggleDetails()'></Button>
    <TextView *ng-if='showDetails' [text]='detailsText'></TextView>
</StackLayout>
`,
})
class MainPage {
    public buttonText: string = "";
    public showDetails: boolean = false;
    public detailsText: string = "";

    constructor() {
        this.buttonText = 'Save...'
        this.showDetails = true;
        this.detailsText = 'Some details and all...';
    }

    onSave($event, name) {
        console.log('onSave event ' + $event + ' name ' + name);
        alert(name);
    }
    onToggleDetails() {
        console.log('onToggleDetails current: ' + this.showDetails);
        this.showDetails = !this.showDetails;
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
