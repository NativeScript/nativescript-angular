import {
    animate,
    animateChild,
    query,
    style,
    transition,
    trigger,
} from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    template: `
        <StackLayout class="parent" width="500" height="500" [@parent]="parentVal">
          <StackLayout class="child" [@child]="childVal"></StackLayout>>
        </StackLayout>
    `,
    animations: [
        trigger("parent", [
            transition("* => *", [
                style({ transform: "translate(200px)" }),
                animate(1000, style({ transform: "translate(0px)" })),
                query("@child", animateChild())
            ])
        ]),
        trigger("child", [
            transition("* => *", [
                style({ opacity: 0 }),
                animate(400, style({ opacity: 1 }))
            ])
        ])
    ],
    styles: [
        `.parent {
            background-color: red;
        }`,
        `.child {
            height: 50%;
            width: 50%;
            background-color: green;
        }`,
    ],
})
export class AnimateChildComponent {
    public parentVal;
    public childVal;
}
