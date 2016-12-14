import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'list-test',
    template: `
        <GridLayout rows="* auto" automationText="mainView"> 
            <ListView [items]="myItems">
                <template let-item="item">
                    <GridLayout>
                        <Label [text]="'Item ' + item"></Label>
                        <Label *ngIf="item === 'error'" text="ERROR"></Label>
                    </GridLayout>
                </template>
            </ListView>

            <Button text="navigate" row="1" [nsRouterLink]="['/first']"></Button>
        </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewWithNestedTemplateComponent {
    public myItems: string[] = ["one", "two"];

    constructor() {
    }
}
