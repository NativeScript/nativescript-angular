import { Component } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
    template: `
        <StackLayout>
            <Button
                text="Hide me!"
                [@someCoolAnimation]="bindingVar"
                (tap)="hide()"
                backgroundColor="hotpink"
                height="200"
            ></Button>

            <Button
                text="Toggle!"
                (tap)="toggle()"
                backgroundColor="red"
            ></Button>
        </StackLayout>
    `,
    animations: [
        trigger("someCoolAnimation", [
            transition("* => fadeIn", [
                style({ opacity: 0 }),
                animate(600, style({ opacity: 1 }))
            ]),
            transition("* => fadeOut", [
                animate(600, style({ opacity: 0 }))
            ])
        ])
    ]
})
export class FadeInOutComponent {
    bindingVar = "";

    fadeIn() {
        this.bindingVar = "fadeIn";
    }

    fadeOut() {
        this.bindingVar = "fadeOut";
    }

    toggle() {
        this.bindingVar == "fadeOut" ? this.fadeIn() : this.fadeOut();
    }

    hide() {
        this.fadeOut();
    }
}
