import {Component} from '@angular/core';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ComponentInstruction} from '@angular/router';

import {NavComponent} from "./nav-component";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";

@Component({
    selector: "start-nav-test",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout verticalAlignment="center">
        <Button text="Start" [nsRouterLink]="['/Nav', { depth: 1 }]"></Button>
        <Button text="Navigate to Detail" [nsRouterLink]="['/Nav', { depth: 1 }, 'Detail', { id: 3 }]"></Button>
    </StackLayout>
    `
})
class StartComponent {
    constructor() {
        console.log("StartComponent.constructor()")
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("StartComponent.routerOnActivate()")
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("StartComponent.routerOnDeactivate()")
    }
}

@Component({
    selector: 'navigation-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
@RouteConfig([
    { path: '/', component: StartComponent, name: 'Start' },
    { path: '/nav/:depth/...', component: NavComponent, name: 'Nav' },
])
export class NavigationTest {

}
