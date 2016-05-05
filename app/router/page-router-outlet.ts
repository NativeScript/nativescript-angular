import {Component} from "@angular/core";
import {RouteConfig} from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {FirstComponent} from "../components/first.component";
import {SecondComponent} from "../components/second.component";

@Component({
    selector: 'navigation-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
@RouteConfig([
    { path: '/first', component: FirstComponent, name: 'First', useAsDefault: true },
    { path: '/second', component: SecondComponent, name: 'Second' },
])
export class NavigationTestPageRouter { }

// nativeScriptBootstrap(NavigationTestPageRouter, [NS_ROUTER_PROVIDERS]);