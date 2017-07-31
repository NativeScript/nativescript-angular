import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes,
} from '@angular/animations';

@Component({
    selector: "animation-states",
    template: `
        <StackLayout>
            <Button text="Touch me!" [@state]=" isOn ? 'active' : 'inactive' " (tap)="onTap()"></Button>
        </StackLayout>`,
    animations: [
        trigger("state", [
            state("active", style({ transform: "translateX(0)", opacity: 1 })),
            state("inactive", style({ transform: "translateX(0)", opacity: 0.2 })),
            transition("inactive => active", [
                animate(300, keyframes([
                    style({opacity: 0.2, transform: "translateX(-100),translateY(100)", offset: 0}),
                    style({opacity: 1, transform: "translateX(15)", offset: 0.3}),
                    style({opacity: 1, transform: "translateX(0)", offset: 1.0})
                ]))
            ]),
            transition("active => inactive", [
                animate(300, keyframes([
                    style({opacity: 1, transform: "translateX(0)", offset: 0}),
                    style({opacity: 1, transform: "translateX(-15)", offset: 0.7}),
                    style({opacity: 0.2, transform: "translateX(100)", offset: 1.0})
                ]))
            ])
        ])
    ]
})
export class AnimationKeyframesTest {

    isOn = false;

    onTap() {
        this.isOn = !this.isOn;
    }
}

