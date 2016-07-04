// >> router-outlet-example
import {Component} from '@angular/core';
import {nativeScriptBootstrap} from 'nativescript-angular/application';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';

import {APP_ROUTER_PROVIDERS} from "./app.routes";

@Component({
    selector: 'navigation-test',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
        <StackLayout>
            <StackLayout class="nav">
                <Button text="First" 
                    [nsRouterLink]="['/first']"></Button>
                <Button text="Second"
                    [nsRouterLink]="['/second']"></Button>
            </StackLayout>
            
            <router-outlet></router-outlet>
        </StackLayout>
    `
})
export class NavigationApp {
    // >> (hide)
    constructor(public router: Router) { }
    // << (hide)
}

// >> (hide)
function start_snippet() {
// << (hide)
nativeScriptBootstrap(NavigationApp, [APP_ROUTER_PROVIDERS]);
// >> (hide)
}
// << (hide)
// << router-outlet-example