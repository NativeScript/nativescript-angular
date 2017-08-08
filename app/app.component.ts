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
        query(':leave', animate(500, style({ transform: 'translateX(400)' }))),
        query(':enter', animate(500, style({ transform: 'translateX(0)' }))),
    ], { delay: 10 }) // Needed because a wierd animation scheduling bug in IOS
]

const slideRight = [
    query(':leave', style({ transform: 'translateX(0)'})),
    query(':enter', style({ transform: 'translateX(400)'})),

    group([
        query(':leave', animate(500, style({ transform: 'translateX(-400)' })), { delay: 100 }),
        query(':enter', animate(500, style({ transform: 'translateX(0)' })), { delay: 100 }),
    ], { delay: 10 }) // Needed because a wierd animation scheduling bug in IOS
]

@Component({
    template: `
        <GridLayout [@routeAnimation]="prepRouteState(routerOutlet)">
            <router-outlet #routerOutlet="outlet"></router-outlet>
        </GridLayout>
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


