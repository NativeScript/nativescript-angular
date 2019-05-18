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
    selector: "hero-list-enter-leave",
    template: `
        <FlexboxLayout>
            <Button *ngFor="let hero of heroes"
                [@flyInOut]="'in'"
                [text]="hero.name"
            ></Button>
        </FlexboxLayout>
  `,
    styleUrls: ["./hero-list.component.css"],
    /* The element here always has the state "in" when it
     * is present. We animate two transitions: From void
     * to in and from in to void, to achieve an animated
     * enter and leave transition. The element enters from
     * the left and leaves to the right using translateX.
     */
    animations: [
        trigger("flyInOut", [
            state("in", style({ transform: "translateX(0)" })),
            transition("void => *", [
                style({ transform: "translateX(-100%)" }),
                animate(100)
            ]),
            transition("* => void", [
                animate(100, style({ transform: "translateX(100%)" }))
            ])
        ])
    ]
})
export class HeroListEnterLeaveComponent {
    @Input() heroes: Heroes;
}
