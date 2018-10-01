import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DataItem } from "./data-item";

@Component({
    moduleId: module.id,
    selector: "list-test",
    styleUrls: ["./list-view-page.css"],
    template: `
                <StackLayout automationText="mainView">
                    <ListView [items]="myItems" (itemTap)="onItemTap($event)"
                    iosOverflowSafeArea="false" >
                        <ng-template let-item="item" let-i="index" let-odd="odd" let-even="even">
                            <StackLayout [class.odd]="odd" [class.even]="even">
                                <Label [text]='"index: " + i'></Label>
                                <Label [text]='"[" + item.id +"] " + item.name'></Label>
                            </StackLayout>
                        </ng-template>
                    </ListView>
                    <TextView [text]="results" automationText="tvResults" textWrap="true"></TextView>
                </StackLayout>
            `
})

export class ListViewComponent {
    public myItems: Array<DataItem>;
    public results: string;
    private counter: number;

    constructor() {
        this.results = "";
        this.myItems = [];
        this.counter = 0;
        for (let i = 0; i < 5; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
            this.counter = i;
        }
    }

    public onItemTap(args) {
        this.results += "ItemTapped: " + args.index + "; \n";
    }
}
