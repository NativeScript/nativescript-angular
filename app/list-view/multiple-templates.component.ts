import { Observable as RxObservable } from "rxjs";
import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { DataItem } from "./data-item";

@Component({
    styles: [".odd { background-color : yellow } .even{ background-color : green }"],
    template: `
        <ListView [items]="myItems"
            itemTemplateSelector="$index % 10 === 0 ? 'red' : id % 2 === 0 ? 'green' : 'yellow'">
            <ng-template let-item="item" let-i="index" nsTemplateKey="red">
                <StackLayout style="background-color:red" >
                    <Label [text]='"index: " + item.name'></Label>
                </StackLayout>
            </ng-template>
            <ng-template let-item="item"let-i="index" nsTemplateKey="green">
                <StackLayout class="even" >
                    <Label [text]='"index: " + item.name'></Label>
                </StackLayout>
            </ng-template>
            <ng-template let-item="item" let-i="index" nsTemplateKey="yellow">
                <StackLayout class="odd">
                    <Label [text]='"index: " + item.name'></Label>
                </StackLayout>
            </ng-template>
        </ListView>
    `
})
export class ListViewMultipleTemplatesComponent {
    public myItems: Array<DataItem> = [];

    constructor() {
        for (let i = 0; i < 12; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
        }
    }
}
