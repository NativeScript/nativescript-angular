import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

@Component({
    selector: "animation-states-multi",
    template: `
        <StackLayout>
            <Button *ngFor="let hero of heroes"
                [text]="hero.name"
                [@heroState]="hero.state"
                (tap)="toggleState(hero)"
            ></Button>
        </StackLayout>
    `,
    animations: [
        trigger('heroState', [
            state('inactive', style({
                backgroundColor: 'green',
                transform: 'scale(1)'
            })),
            state('active',   style({
                backgroundColor: 'red',
                transform: 'scale(2)'
            })),

            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out')),
        ])
    ]
})
export class AnimationStatesMultiTest {
    heroes =  [
        {
            name: "Windstorm",
            state: "inactive"
        },
        {
            name: "Batman",
            state: "active"
        },
    ];

    toggleState(hero) {
        hero.state = hero.state === "active" ? "inactive" : "active";
    }
}


