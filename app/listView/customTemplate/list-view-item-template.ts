import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'custom-template',
    template: `
        <StackLayout>
            <Label *ngFor="let element of data.list" [text]="element.text"></Label>
        </StackLayout>
    `
})
export class CustomTemplate {
    @Input() data: any;
    constructor() { }
}

@Component({
    selector: 'list-test',
    template: `
        <GridLayout rows="*" automationText="mainView"> 
            <ListView [items]="myItems">
                <template let-item="item">
                    <custom-template [data]="item"></custom-template>
                </template>
            </ListView>
        </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewControlComponent {
    public myItems: Array<any>;
    private counter: number;

    constructor() {
        var list = [{ "text": "a" }, { "text": "b" }];
        var list1 = [{ "text": "c" }, { "text": "d" }];
        this.myItems = [{ "list": list }, { "list": list1 }];
    }
}

