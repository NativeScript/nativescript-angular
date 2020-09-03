import {
    animate,
    query,
    style,
    transition,
    trigger,
} from "@angular/animations";
import { Component, NgZone } from "@angular/core";

@Component({
    moduleId: module.id,
    animations: [
        trigger("listAnimation", [

            transition(":enter", [
                query("*", [
                    style({ opacity: 0 }),
                    animate(1000, style({ opacity: 1 }))
                ])
            ]),

            transition(":leave", [
                query("*", [
                    style({ opacity: 1 }),
                    animate(1000, style({ opacity: 0 }))
                ])

            ])
        ]),
    ],
    template: `
        <FlexboxLayout flexDirection="column"
            automationText="itemsContainer">
            <Button text="add" automationText="add" (tap)="addRandom()"></Button>

            <FlexboxLayout
                flexDirection="column"
                [@listAnimation]="items.length"
                *ngFor="let item of items; let i=index">

                <FlexboxLayout justifyContent="center" alignItems="center"> 
                    <Label [text]="'Item No.' + i"></Label>
                    <Button [text]="item" (tap)="remove(item)"></Button>
                </FlexboxLayout> 

            </FlexboxLayout>

        </FlexboxLayout>
    `
})
export class SelectorAllComponent {
    public items = [
        "first",
        "second",
    ];

    constructor(private zone: NgZone) {}

    add() {
        const newItem = `Item ${this.items.length}`;
        this.items.push(newItem);
    }

    addRandom() {
      // this.zone.run(() => {
        this.items.push('random');
      // });
    }

    remove(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1)
    }
}
