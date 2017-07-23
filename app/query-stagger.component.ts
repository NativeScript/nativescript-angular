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
                query(":enter", stagger("200ms", [
                    animate("1s", style({ opacity: 1 }))
                ]))
            ])
        ])
    ],
    template: `		
        <StackLayout>		
            <Button (tap)="add()" text="ADD" backgroundColor="hotpink"></Button>		
 		
            <StackLayout [@listAnimation]="items.length"> 		
                <ng-template ngFor let-item let-i="index" [ngForOf]="items"> 		
                    <Button
                      [text]="item"		
                      class="ani-button"		
                    ></Button>		
                </ng-template>		
 		
            </StackLayout>		
        </StackLayout>		
    `
})
export class QueryStaggerComponent {
    public items = [
        "Enter",
        "With",
        "Stagger",
    ];

    add() {
        const newItem = `Item ${this.items.length}`;
        this.items.push(newItem);
    }
}
