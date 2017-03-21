import {Component, trigger, style, animate, state, transition } from "@angular/core";

@Component({
    selector: "animation-states",
    template: `
        <StackLayout>
            <Button text="Touch me!" [@state]=" isOn ? 'active' : 'inactive' " (tap)="onTap()"></Button>
        </StackLayout>`,
    animations: [
        trigger("state", [
            state("inactive", style({ "background-color": "red" })),
            state("active", style({ "background-color": "green" })),
            transition("inactive => active", [ animate("600ms ease-out") ]),
            transition("active => inactive", [ animate("600ms ease-out") ]),
        ])
    ]
})
export class AnimationStatesTest {

    isOn = false;

    onTap() {
        this.isOn = !this.isOn;
    }
}

