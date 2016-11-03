import { Component, Input, ChangeDetectionStrategy, DoCheck } from '@angular/core';

class DataItem {
    private static count = 0;
    public id: number;
    constructor(public name: string, public isHeader: boolean) {
        this.id = DataItem.count++;
    }
}

@Component({
    selector: 'item-component',
    styleUrls: ['examples/list/styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<Label class="item" [text]='"[" + data.id +"]" + data.name'></Label>`
})
export class ItemComponent implements DoCheck {
    @Input() data: DataItem;
    ngDoCheck() { console.log("ItemComponent.ngDoCheck: " + this.data.id); }
}

@Component({
    selector: 'header-component',
    styleUrls: ['examples/list/styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<Label class="header" [text]='data.name'></Label>`
})
export class HeaderComponent implements DoCheck {
    @Input() data: DataItem;
    ngDoCheck() { console.log("HeaderComponent.ngDoCheck: " + this.data.id); }
}

@Component({
    selector: 'list-test',
    styleUrls: ['examples/list/styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <GridLayout rows="auto * auto">
            <Label text="ListView With Template Selector" class="list-title"></Label>

            <ListView [items]="myItems" (itemTap)="onItemTap($event)" row="1" margin="10" [itemTemplateSelector]="templateSelector">
                
                <template nsTemplateKey="header" let-item="item" let-i="index" let-odd="odd" let-even="even">
                    <header-component [data]="item"></header-component>
                </template>
                
                <template nsTemplateKey="item" let-item="item" let-i="index" let-odd="odd" let-even="even">
                    <item-component [data]="item"></item-component>
                </template>
            </ListView>

            <Button text="add item" (tap)="addItem()" row="2" ></Button>
        </GridLayout>
    `
})
export class ListTemplateSelectorTest {
    public myItems: Array<DataItem>;

    public templateSelector = (item: DataItem, index: number, items: any) => {
        return item.isHeader ? "header" : "item";
    }
    constructor() {
        this.myItems = [];
        for (let headerIndex = 0; headerIndex < 10; headerIndex++) {
            this.myItems.push(new DataItem("Header " + headerIndex, true));

            for (let i = 1; i < 10; i++) {
                this.myItems.push(new DataItem(`item ${headerIndex}.${i}`, false));
            }
        }
    }

    public onItemTap(args) {
        console.log("--> ItemTapped: " + args.index);
    }

    addItem() {
        this.myItems.push(new DataItem("added item", false));
    }

    public static entries = [
        ItemComponent,
        HeaderComponent
    ];
}
