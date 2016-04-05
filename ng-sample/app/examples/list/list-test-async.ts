import { Component, Input, ChangeDetectionStrategy } from 'angular2/core';
import { Observable as RxObservable } from 'rxjs/Observable';

export class DataItem {
    constructor(public id: number, public name: string) { }
}

@Component({
    selector: 'list-test-async',
    styleUrls: ['examples/list/list-test-async.css'],
    template: `
    <GridLayout>
        <ListView [items]="myItems | async" (itemTap)="onItemTap($event)">
            <template #item="item" #i="index" #odd="odd" #even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label class="test" [text]='"index: " + item.name'></Label>
                </StackLayout>
            </template>
        </ListView>
    </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTestAsync {
    public myItems: RxObservable<Array<DataItem>>;

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
            }
        });

        let counter = 2;
        let intervalId = setInterval(() => {
            counter++;
            console.log("Adding " + counter + "-th item");
            items.push(new DataItem(counter, "data item " + counter));
            subscr.next(items);
        }, 1000);
        
        setTimeout(() => {
            clearInterval(intervalId);   
        }, 15000);
    }

    public onItemTap(args) {
        console.log("------------------------ ItemTapped: " + args.index);
    }
}