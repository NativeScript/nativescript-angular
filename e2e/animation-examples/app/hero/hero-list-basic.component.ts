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
    selector: "hero-list-basic",
    /* The click event calls hero.toggleState(), which
    * causes the state of that hero to switch from
    * active to inactive or vice versa.
        */
    template: `
        <FlexboxLayout>
            <Button *ngFor="let hero of heroes"
                [@heroState]="hero.state"
                (tap)="hero.toggleState()"
                [text]="hero.name"
            ></Button>
        </FlexboxLayout>
    `,
    styleUrls: ["./hero-list.component.css"],
    /**
        * Define two states, "inactive" and "active", and the end
    * styles that apply whenever the element is in those states.
        * Then define animations for transitioning between the states,
    * one in each direction
    */
    animations: [
        trigger("heroState", [
            state("inactive", style({
                backgroundColor: "#eee",
                transform: "scale(1)"
            })),
            state("active",   style({
                backgroundColor: "#cfd8dc",
                transform: "scale(1.1)"
            })),

            transition("inactive => active", animate("100ms ease-in")),
            transition("active => inactive", animate("100ms ease-out")),
        ])
    ]
})
export class HeroListBasicComponent {
    @Input() heroes: Heroes;
}
