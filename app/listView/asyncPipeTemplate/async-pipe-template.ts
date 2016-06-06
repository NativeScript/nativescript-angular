import { Observable as RxObservable } from 'rxjs/Observable';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export class DataItem {
    constructor(public id: number, public name: string) { }
}

@Component({
    selector: 'list-test-async',
    template: `
    <GridLayout rows='*,60' automationText="mainView">
        <ListView [items]="myItems | async">
            <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label [text]='"index: " + item.name'></Label>
                </StackLayout>
            </template>
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
        var items = [];
        for (var i = 0; i < 3; i++) {
            items.push(new DataItem(i, "data item " + i));
        }

        var subscr;
        this.myItems = RxObservable.create(subscriber => {
            subscr = subscriber;
            subscriber.next(items);
            return function () {
                console.log("Unsubscribe called!!!");
                this.output = "Unsubscribe called!!!";
            }
        });

        let counter = 2;
        let intervalId = setInterval(() => {
            counter++;
            items.push(new DataItem(counter, "data item " + counter));
            subscr.next(items);
        }, 500);

        setTimeout(() => {
            clearInterval(intervalId);
        }, 5000);
    }
}