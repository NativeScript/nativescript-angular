import { Component } from "@angular/core";
import {
    animate,
    animateChild,
    group,
    query,
    style,
    transition,
    trigger,
} from "@angular/animations";

const slideLeft = [
    query(':leave', style({ transform: 'translateX(0)' })),
    query(':enter', style({ transform: 'translateX(-400)' })),
    group([
        query(':leave', animate(1000, style({ transform: 'translateX(400)' }))),
        query(':enter', animate(2000, style({ transform: 'translateX(0)' }))),
    ])
]

const slideRight = [
    query(':leave', style({ transform: 'translateX(0)'})),
    query(':enter', style({ transform: 'translateX(400)'})),

    group([
        query(':leave', animate(2000, style({ transform: 'translateX(-400)' }))),
        query(':enter', animate(2000, style({ transform: 'translateX(0)' }))),
    ])
]

@Component({
    template: `
        <div [@routeAnimation]="prepRouteState(routerOutlet)">
            <router-outlet #routerOutlet="outlet"></router-outlet>
        </div>
    `,
    animations: [
        trigger('routeAnimation', [
            transition('homePage => supportPage', slideRight),
            transition('supportPage => homePage', slideLeft),
        ])
    ],
})
export class AppComponent {
    prepRouteState(outlet: any) {
        return outlet.activatedRouteData['animation'] || 'firstPage'; 
    }

}


