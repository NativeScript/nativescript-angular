import {Component, Input, WrappedValue, ChangeDetectionStrategy} from '@angular/core';
import {Label} from 'ui/label';
import {ObservableArray} from 'data/observable-array';

class DataItem {
    constructor(public id: number, public name: string) { }
}

// @Component({
//     selector: 'item-component',
//     template: `
//         <StackLayout [class.odd]="odd" [class.even]="even">
//             <Label [text]='"id: " + data.id'></Label>
//             <Label [text]='"name: " + data.name'></Label>
//         </StackLayout>
//     `
// })
// export class ItemComponent {
//     @Input() data: DataItem;
//     @Input() odd: boolean;
//     @Input() even: boolean;
//     constructor() { }
// }

@Component({
    selector: 'list-test',
    //directives: [ItemComponent],
    template: `
            <GridLayout rows="auto, *, auto, auto">
            <Label row="0" text="-==START==-" fontSize="20"></Label>
            <GridLayout row="1">
                <ListView [items]="myItems" (itemTap)="onItemTap($event)">
                    <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                        <StackLayout [class.odd]="odd" [class.even]="even">
                            <Label [text]='"index: " + i'></Label>
                            <Label [text]='"[" + item.id +"] " + item.name'></Label>
                        </StackLayout>
                    </template>
                </ListView>
            </GridLayout>
            <Label row="2" id="testLabel" text="-==END==-" fontSize="20"></Label>
            <StackLayout row="3">
                <Button text="test" (tap)="onButtonTap()" ></Button>
                <Button text="second test" (tap)="onSecondButtonTap($event)" ></Button>
            </StackLayout>
        </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
    // TEMPLATE WITH COMPONENT
    // <template #item="item" #i="index" #odd="odd" #even="even">
    //     <item-component [data]="item" [odd]='odd' [even]='even'></item-component>
    // </template>
    
    // IN-PLACE TEMPLATE
    // <template #item="item" #i="index" #odd="odd" #even="even">
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
        for (var i = 0; i < 50; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
            this.counter = i;
        }
    }

    public onItemTap(args) {
        console.log("------------------------ ItemTapped: " + args.index);
    }
    
    onButtonTap() {
        this.counter++;
        this.myItems.push(new DataItem(this.counter, "data item " + this.counter));
    }
    
    onSecondButtonTap(args) {
        var page = args.object.page;
        var label = <Label>page.getViewById("testLabel");
        label.text = "Alabala";
    }
}

