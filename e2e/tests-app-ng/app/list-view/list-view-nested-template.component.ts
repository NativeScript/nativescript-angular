import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "list-test",
    template: `
        <GridLayout rows="* auto" automationText="mainView" iosOverflowSafeArea="false" >
            <ListView [items]="myItems">
                <ng-template let-item="item">
                    <GridLayout>
                        <Label [text]="'Item ' + item"></Label>
                        <Label *ngIf="item === 'error'" text="ERROR"></Label>
                    </GridLayout>
                </ng-template>
            </ListView>
            <Button text="navigate" row="1" [nsRouterLink]="['/first']"></Button>
        </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewWithNestedTemplateComponent {
    public myItems: string[] = ["one", "two"];
}
