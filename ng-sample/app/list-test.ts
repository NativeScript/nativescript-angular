import {Component, Input} from 'angular2/core';

class DataItem {
    constructor(public id: number, public name: string) { }
}

@Component({
    selector: 'item-component',
    template: `
        <StackLayout [class.odd]="odd" [class.even]="even">
            <Label [text]='"id: " + data.id'></Label>
            <Label [text]='"name: " + data.name'></Label>
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
    directives: [ItemComponent],
    template: `
            <GridLayout rows="auto, *, auto">
            <Label row="0" text="-==START==-" fontSize="20"></Label>
            
            <GridLayout row="1">
            
                <ListView [items]="myItems" (itemTap)="onItemTap($event)">
                    <item-template>
                        <template #item="item" #i="index" #odd="odd" #even="even">
                            <StackLayout [class.odd]="odd" [class.even]="even">
                                <Label [text]='"index: " + index'></Label>                        
                                <Label [text]='"[" + item.id +"]" + item.name'></Label>
                            </StackLayout>
                        </template>
                    </item-template>
                </ListView>   
                         
            </GridLayout>
            
            <Label row="2" text="-==END==-" fontSize="20"></Label>
        </GridLayout>
    `
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
    public myItems: Array<DataItem>;

    constructor() {
        this.myItems = [];
        for (var i = 0; i < 30; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
        }
    }

    public onItemTap(args) {
        console.log("------------------------ ItemTapped: " + args.index);
    }
}

