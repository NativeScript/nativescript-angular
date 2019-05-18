import {
    Component,
    Input
} from "@angular/core";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from "@angular/animations";

import { Heroes } from "./hero.service";

@Component({
    moduleId: module.id,
    selector: "hero-list-enter-leave-states",
    template: `
        <FlexboxLayout>
        <Button *ngFor="let hero of heroes"
            (click)="hero.toggleState()"
            [@heroState]="hero.state"
            [text]="hero.name"
        ></Button>
        </FlexboxLayout>
  `,
    styleUrls: ["./hero-list.component.css"],
    /* The elements here have two possible states based
     * on the hero state, "active", or "inactive". We animate
     * six transitions: Between the two states in both directions,
     * and between each state and void. With this we can animate
     * the enter and leave of elements differently based on which
     * state they are in when they are added and removed.
     */
    animations: [
        trigger("heroState", [
            state("inactive", style({ transform: "translateX(0) scale(1)" })),
            state("active", style({ transform: "translateX(0) scale(1.1)" })),
            transition("inactive => active", animate("100ms ease-in")),
            transition("active => inactive", animate("100ms ease-out")),
            transition("void => inactive", [
                style({ transform: "translateX(-100%) scale(1)" }),
                animate(100)
            ]),
            transition("inactive => void", [
                animate(100, style({ transform: "translateX(100%) scale(1)" }))
            ]),
            transition("void => active", [
                style({ transform: "translateX(0) scale(0)" }),
                animate(200)
            ]),
            transition("active => void", [
                animate(200, style({ transform: "translateX(0) scale(0)" }))
            ])
        ])
    ]
})
export class HeroListEnterLeaveStatesComponent {
    @Input() heroes: Heroes;
}
