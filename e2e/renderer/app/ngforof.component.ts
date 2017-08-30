import { Component } from "@angular/core";

import { ItemsService } from "./items.service";
import { ItemsAccessor } from "./items-accessor";

@Component({
    template: `
        <ActionBar title="ngForOf"></ActionBar>
        <Stacklayout> 
            <ng-template ngFor let-item [ngForOf]="items">
                <Label [text]="'label: ' + item"></Label>
                <Button (tap)="remove(item)" [text]="item"></Button>
            </ng-template>

            <Button text="add" backgroundColor="green" (tap)="add()"></Button>
            <Button text="remove" backgroundColor="red" (tap)="remove()"></Button>
        </Stacklayout>
    `
})
export class NgForOfComponent extends ItemsAccessor {
    constructor(public itemsService: ItemsService) {
        super(itemsService);
    }
}

