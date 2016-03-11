import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ComponentInstruction} from 'angular2/router';

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
    template: `
    <GridLayout>
        <page-router-outlet></page-router-outlet>
    </GridLayout>
    `
})
@RouteConfig([
    { path: '/', component: StartComponent, as: 'Start' },
    { path: '/nav/:depth/...', component: NavComponent, as: 'Nav' },
])
export class NavigationTest {

}

