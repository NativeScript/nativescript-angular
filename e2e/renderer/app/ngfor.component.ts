import { Component } from "@angular/core";

import { ItemsService } from "./items.service";
import { ItemsAccessor } from "./items-accessor";

@Component({
    template: `
        <ActionBar title="ngFor"></ActionBar>
        <StackLayout>
             <Button *ngFor="let item of items" (tap)="remove(item)" [text]="item"></Button>
             <Button (tap)="add()" text="add"></Button>
             <Button (tap)="remove()" text="remove"></Button>
        </StackLayout>
    `
})
export class NgForComponent extends ItemsAccessor {
    constructor(public itemsService: ItemsService) {
        super(itemsService);
    }
}

