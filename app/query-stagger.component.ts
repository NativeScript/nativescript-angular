import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
} from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    moduleId: module.id,
    animations: [
        trigger("listAnimation", [
            transition("* => *", [
                // this hides everything right away
                query(":enter", style({ opacity: 0 })),

                // starts to animate things with a stagger in between
                query(":enter", stagger(200, [
                    animate(1000, style({ opacity: 1 }))
                ]), { delay: 200 })
            ])
        ])
    ],
    template: `		
        <StackLayout>		
            <Button (tap)="add()" text="ADD" backgroundColor="hotpink"></Button>		
 		
            <StackLayout [@listAnimation]="items.length" automationText="container" > 		
                <Button *ngFor="let item of items" [text]="item" class="ani-button"></Button>		
            </StackLayout>		
        </StackLayout>		
    `
})
export class QueryStaggerComponent {
    public items = [
        "Dramatic",
        "Entrance",
        "With",
        "Really",
        "Cool",
        "Stagger",
    ];

    add() {
        const newItem = `Item ${this.items.length}`;
        this.items.push(newItem);
    }
}
