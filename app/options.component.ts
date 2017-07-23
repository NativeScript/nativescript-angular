import { trigger, transition, style, animate } from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    template: `
        <StackLayout>
           <Button
                *ngIf="animationData.value === 'active'"
                [@someCoolAnimation]="animationData"
                text="hello there"
            ></Button>

            <Button
                (tap)="fadeOut()"
                text="Remove above button"
                backgroundColor="green"
                color="white"
            ></Button>
        </StackLayout>
    `,
    animations: [
        trigger("someCoolAnimation", [
            transition(":leave", [
                animate("{{ time }}", style({ opacity: "{{ minOpacity }}" }))
            ]),
        ]),
    ],
})
export class OptionsComponent {
    public animationData = {
        value: "active",
        params: {
            time: "0.5s",
            minOpacity: 0,
        }
    };

    fadeOut() {
        this.animationData.value = "inactive";
    }
}

