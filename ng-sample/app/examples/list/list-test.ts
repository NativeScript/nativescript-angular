import {Component, Input, WrappedValue, ChangeDetectionStrategy} from '@angular/core';
import {Label} from 'ui/label';
import {ObservableArray} from 'data/observable-array';

class DataItem {
    constructor(public id: number, public name: string) { }
}

@Component({
    selector: 'item-component',
    styleUrls: ['examples/list/styles.css'],    
    template: `
        <StackLayout [class.odd]="odd" [class.even]="even">
            <Label [text]='"[" + data.id + "]name: " + data.name'></Label>
        </StackLayout>
    `
})
export class ItemComponent {
    @Input() data: DataItem;
    @Input() odd: boolean;
    @Input() even: boolean;
    constructor() { }
}

@Component({
    selector: 'list-test',
    styleUrls: ['examples/list/styles.css'],
    directives: [ItemComponent],
    template: `
        <GridLayout rows="auto * auto" columns="* *">
            <Label text="ListView" class="list-title"></Label>
            <Label text="*ngFor" class="list-title" col="1"></Label>

            <ListView [items]="myItems" (itemTap)="onItemTap($event)" row="1" margin="10">
                <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                    <item-component [data]="item" [odd]="odd" [even]="even"></item-component>
                </template>
            </ListView>

            <StackLayout row="1" col="1" margin="10">
                <StackLayout *ngFor="let item of myItems; let odd = odd; let even = even" 
                    [class.odd]="odd" [class.even]="even" marginBottom="1">
                    <item-component [data]="item" [odd]="odd" [even]="even"></item-component>
                </StackLayout>
            </StackLayout>

            <StackLayout row="2" colspan="2" orientation="horizontal">
                <Button text="add item" (tap)="addItem()" ></Button>
                <Button text="second test" (tap)="onSecondButtonTap($event)" ></Button>
            </StackLayout>
        </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
    // TEMPLATE WITH COMPONENT
    // <template let-item="item" let-i="index" let-odd="odd" let-even="even">
    //     <item-component [data]="item" [odd]='odd' [even]='even'></item-component>
    // </template>
    
    // IN-PLACE TEMPLATE
    // <template let-item="item" let-i="index" let-odd="odd" let-even="even">
    //     <StackLayout [class.odd]="odd" [class.even]="even">
    //         <Label [text]='"index: " + i'></Label>                        
    //         <Label [text]='"[" + item.id +"]" + item.name'></Label>
    //     </StackLayout>
    // </template>
})
export class ListTest {
    //public myItems: ObservableArray<DataItem>;
    public myItems: Array<DataItem>;
    private counter: number;

    constructor() {
        //this.myItems = new ObservableArray<DataItem>();
        this.myItems = [];
        this.counter = 0;
        for (var i = 0; i < 10; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
            this.counter = i;
        }
    }

    public onItemTap(args) {
        console.log("--> ItemTapped: " + args.index);
    }
    
    addItem() {
        this.counter++;
        this.myItems.push(new DataItem(this.counter, "data item " + this.counter));
    }
    
    onSecondButtonTap(args) {
        var page = args.object.page;
        var label = <Label>page.getViewById("testLabel");
        label.text = "Alabala";
    }
}