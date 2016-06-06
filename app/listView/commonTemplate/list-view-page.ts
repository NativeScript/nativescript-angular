import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'list-test',
    styleUrls: ['./listView/commonTemplate/list-view-page.css'],
    template: ` 
                <StackLayout>
                    <ListView [items]="myItems" (itemTap)="onItemTap($event)">
                        <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                            <StackLayout [class.odd]="odd" [class.even]="even">
                                <Label [text]='"index: " + i'></Label>
                                <Label [text]='"[" + item.id +"] " + item.name'></Label>
                            </StackLayout>
                        </template>
                    </ListView>
                    <TextView [text]="results" automationText="tvResults" textWrap="true"></TextView>
                </StackLayout>
            `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListViewComponent {
    public myItems: Array<DataItem>;
    public results: string;
    private counter: number;

    constructor() {
        this.results = '';
        this.myItems = [];
        this.counter = 0;
        for (var i = 0; i < 5; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
            this.counter = i;
        }
    }

    public onItemTap(args) {
        this.results += "ItemTapped: " + args.index + "; \n";
    }
}


class DataItem {
    constructor(public id: number, public name: string) { }
}