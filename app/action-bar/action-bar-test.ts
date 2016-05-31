import {Component} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";
import {FirstComponentActionBar} from "./action-bar-first.component";
import {SecondComponentActionBar} from "./action-bar-second.component";

@Component({
    selector: 'action-bar-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <GridLayout>
       <page-router-outlet></page-router-outlet>
    </GridLayout>
    `,
})
@RouteConfig([
    { path: '/first', component: FirstComponentActionBar, name: 'First', useAsDefault: true },
    { path: '/second', component: SecondComponentActionBar, name: 'Second' },
])
export class ActionBarTest { }
