import {
    Component,
    Input,
} from "@angular/core";
import {
    trigger,
    style,
    animate,
    transition
} from "@angular/animations";

import { Heroes } from "./hero.service";

@Component({
    moduleId: module.id,
    selector: "hero-list-inline-styles",
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
    * Then define an animation for the inactive => active transition.
    * This animation has no end styles, but only styles that are
    * defined inline inside the transition and thus are only kept
    * as long as the animation is running.
    */
    animations: [
        trigger("heroState", [
            transition("inactive => active", [
                style({
                    backgroundColor: "#cfd8dc",
                    transform: "scale(1.3)"
                }),
                animate("80ms ease-in", style({
                    backgroundColor: "#eee",
                    transform: "scale(1)"
                }))
            ]),
        ])
    ]
})
export class HeroListInlineStylesComponent {
    @Input() heroes: Heroes;
}
