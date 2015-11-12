import {Inject, Component, View, NgIf, NgFor} from 'angular2/angular2';

@Component({
    selector: 'templated-component',
    templateUrl: 'title.html'
})
export class TemplatedComponent {
}

@Component({
	selector: 'renderer-test'
})
@View({
    directives: [NgIf, NgFor, TemplatedComponent],
	template: `
<StackLayout orientation='vertical'>
    <templated-component></templated-component>
    <Label [class.valid]="isValid" [class.invalid]="!isValid" text='Name' fontSize='20' verticalAlignment='center' padding='20'></Label>
    <TextField #name text='John' fontSize='20' padding='20'></TextField>
    <Button [text]='buttonText' (tap)='onSave($event, name.text, $el)'></Button>
    <Button text='Toggle details' (tap)='onToggleDetails()'></Button>
    <TextView *ng-if='showDetails' [text]='detailsText'></TextView>
    <Label text='==============================' fontSize='20'></Label>
    <StackLayout #more *ng-if='showDetails' orientation='vertical'>
        <TextField *ng-for='#detailLine of detailLines' [text]='detailLine'></TextField>
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
            "ng-for inside a ng-if",
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
