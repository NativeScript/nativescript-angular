import {Component, Directive, Host, ElementRef, Input} from 'angular2/core';

@Component({
    selector: 'templated-component',
    directives: [TemplatedComponent],
    templateUrl: 'title.html'
})
export class TemplatedComponent {
    @Input() public renderChild: boolean = false;
    @Input() public text: string = "Hello, external templates";
}

@Directive({
    selector: 'Progress',
})
export class ProgressComponent {
    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        this.element.nativeElement.value = 90;
    }
}

@Component({
	selector: 'renderer-test',
    directives: [TemplatedComponent, ProgressComponent],
	template: `    
    <StackLayout orientation='vertical'>
        <Progress value="50" style="color: red"></Progress>
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
        <templated-component [renderChild]="true"></templated-component>
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
            "ngFor inside a ngIf 1",
            "ngFor inside a ngIf 2",
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
