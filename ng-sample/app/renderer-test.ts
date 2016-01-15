import {Inject, Component, View} from 'angular2/core';

@Component({
    selector: 'templated-component',
    templateUrl: 'title.html'
})
export class TemplatedComponent {
}

@Component({
	selector: 'renderer-test',
    directives: [TemplatedComponent],
	template: `    
    <StackLayout orientation='vertical'>
        <templated-component *ngIf='showDetails'></templated-component>
        <Label [class.valid]="isValid" [class.invalid]="!isValid" text='Name' fontSize='20' verticalAlignment='center' padding='20'></Label>
        <TextField #name text='John' fontSize='20' padding='20'></TextField>
        <Button [text]='buttonText' (tap)='onSave($event, name.text, $el)'></Button>
        <Button text='Toggle details' (tap)='onToggleDetails()'></Button>
        <TextView *ngIf='showDetails' [text]='detailsText'></TextView>
        <Label text='==============================' fontSize='20'></Label>
        <StackLayout #more *ngIf='showDetails' orientation='vertical'>
            <TextField *ngFor='#detailLine of detailLines' [text]='detailLine'></TextField>
        </StackLayout>
        <Label text='==============================' fontSize='20'></Label>
    </StackLayout>
`,
})
export class RendererTest {
    public buttonText: string = "";
    public showDetails: boolean = false;
    public detailsText: string = "";
    public moreDetailsText: string = "";
    public detailLines: Array<string> = [];
    public isValid: boolean = true;

    constructor() {
        this.buttonText = 'Save...'
        this.showDetails = true;
        this.detailsText = 'plain ng-if directive \ndetail 1-2-3...';
        this.moreDetailsText = 'More details:';

        this.detailLines = [
            "ngFor inside a ngIf",
            "Street address",
            "Country, city",
        ];
    }

    onSave($event, name, $el) {
        console.log('onSave event ' + $event + ' name ' + name);
        alert(name);
    }

    onToggleDetails() {
        console.log('onToggleDetails current: ' + this.showDetails);
        this.showDetails = !this.showDetails;
    }
}
