import { Component } from "@angular/core";
import {
    trigger,
    style,
    animate,
    state,
    transition,
} from "@angular/animations";

@Component({
    selector: "animation-states",
    template: `
        <StackLayout>
            <Button text="Touch me!" [@state]="isOn ? 'active' : 'inactive'" (tap)="onTap()"></Button>
        </StackLayout>`,
    animations: [
        trigger("state", [

            state("inactive", style({
                backgroundColor: "red",
                transform: "scale(0.7)",
            })),
            state("active", style({
                backgroundColor: "green",
                transform: "scale(2)",
            })),

            transition("* => active", [ animate("600ms ease-out") ]),
            transition("* => inactive", [ animate("600ms ease-out") ]),

        ])
    ]
})
export class AnimationStatesTest {
    isOn = false;

    onTap() {
        this.isOn = !this.isOn;
    }
}

