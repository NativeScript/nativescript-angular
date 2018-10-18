import {Component, Input, WrappedValue, ChangeDetectionStrategy, AfterViewChecked, DoCheck} from "@angular/core";
import {Label} from "tns-core-modules/ui/label";
import {ObservableArray} from "tns-core-modules/data/observable-array";

class DataItem {
    constructor(public id: number, public name: string) { }
}

@Component({
    selector: "item-component",
    styleUrls: ["examples/list/styles.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <StackLayout [class.odd]="odd" [class.even]="even">
            <Label [text]='"index: " + index'></Label>                        
            <Label [text]='"[" + data.id +"]" + data.name'></Label>
        </StackLayout>
    `
})
export class ItemComponent implements AfterViewChecked, DoCheck {
    @Input() data: DataItem;
    @Input() odd: boolean;
    @Input() even: boolean;
    @Input() index: boolean;
    constructor() { }

    ngDoCheck() {
        console.log("ItemComponent.ngDoCheck: " + this.data.id);
    }

    ngAfterViewChecked() {
        console.log("ItemComponent.ngAfterViewChecked: " + this.data.id);
    }
}

@Component({
    selector: "list-test",
    styleUrls: ["examples/list/styles.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <GridLayout rows="auto * auto">
            <Label text="ListView" class="list-title"></Label>

            <ListView [items]="myItems" (itemTap)="onItemTap($event)" row="1" margin="10">
                <ng-template let-item="item" let-i="index" let-odd="odd" let-even="even">
                    <item-component [data]="item" [odd]="odd" [even]="even" [index]="i"></item-component>
                </ng-template>
            </ListView>

            <Button text="add item" (tap)="addItem()" row="2" ></Button>
        </GridLayout>
    `
    // TEMPLATE WITH COMPONENT
    // <ng-template let-item="item" let-i="index" let-odd="odd" let-even="even">
    //     <item-component [data]="item" [odd]='odd' [even]='even'></item-component>
    // </ng-template>

    // IN-PLACE TEMPLATE
    // <ng-template let-data="item" let-i="index" let-odd="odd" let-even="even">
    //     <StackLayout [class.odd]="odd" [class.even]="even">
    //         <Label [text]='"index: " + i'></Label>
    //         <Label [text]='"[" + data.id +"]" + data.name'></Label>
    //     </StackLayout>
    // </ng-template>
})
export class ListTest {
    public myItems: Array<DataItem>;
    private counter: number;

    constructor() {
        this.myItems = [];
        this.counter = 0;
        for (let i = 0; i < 100; i++) {
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

    public static entries = [
        ItemComponent
    ];
}
