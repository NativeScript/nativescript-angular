import { Observable as RxObservable } from "rxjs";
import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DataItem } from "./data-item";

@Component({
    selector: "list-test-async",
    template: `
    <GridLayout rows='*,60' automationText="mainView" iosOverflowSafeArea="false" >
        <ListView [items]="myItems | async">
            <ng-template let-item="item" let-i="index" let-odd="odd" let-even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label [text]='"index: " + item.name'></Label>
                </StackLayout>
            </ng-template>
        </ListView>
        <TextView  row='1' [text]='output' automationText="tvResult" textWrap="true"></TextView>
    </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewAsyncPipeComponent {
    public myItems: RxObservable<Array<DataItem>>;
    public output: string;

    constructor() {
        let items = [];
        for (let i = 0; i < 3; i++) {
            items.push(new DataItem(i, "data item " + i));
        }

        let subscr;
        this.myItems = RxObservable.create(subscriber => {
            subscr = subscriber;
            subscriber.next(items);
            return function () {
                console.log("Unsubscribe called!!!");
                this.output = "Unsubscribe called!!!";
            };
        });

        let counter = 2;
        const intervalId = setInterval(() => {
            counter++;
            items.push(new DataItem(counter, "data item " + counter));
            subscr.next(items);
            if (counter == 11) {
                clearInterval(intervalId);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
        }, 11000);
    }
}
