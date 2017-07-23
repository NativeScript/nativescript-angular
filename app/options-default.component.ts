import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

@Component({
    template: `
        <StackLayout>
            <Button
                text="Add hero"
                (tap)="addNew()"
                [isEnabled]="extraHeroes.length > 0"
                [ngClass]="extraHeroes.length > 0 ? 'enabled' : 'disabled'"
            ></Button>


            <Button
                *ngFor="let hero of heroes"
                [text]="hero"
                [@flyInOut]="'in'"
                (tap)="flyOut(hero)"
                backgroundColor="hotpink"
                height="75"
            ></Button>

        </StackLayout>
    `,
    styles: [
        '.enabled: { background-color: green; color: white  }',
        '.disabled: { background-color: grey; color: #777 }'
    ],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translate(0)'})),

            transition('void => *', [
                style({transform: 'translate(100%)'}),
                animate('{{ appearTime }}')
            ], {
                params: {
                    appearTime: '1s'
                }
            }),

            transition('* => void', [
                animate("{{ disappearTime }}",
                    style({transform: 'translateX(100%)'}))
            ], {
                params: {
                    disappearTime: '0.4s'
                }
            })
        ])
    ]
})
export class OptionsDefaultComponent {
    public heroes = ["Harley Quinn", "Wonder Woman", "Joker", "Aquaman"];
    public extraHeroes = ["Batman", "Superman", "Killer Frost", "The Flash"];

    flyOut(hero) {
        const heroIndex = this.heroes.indexOf(hero);

        this.extraHeroes.push(hero);
        this.heroes.splice(heroIndex, 1);
    }

    addNew() {
        const newHero = this.extraHeroes.pop();
        this.heroes.push(newHero);
    }
}
