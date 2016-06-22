import {ROUTER_DIRECTIVES, Router, RouterConfig } from '@angular/router';
import {nsProvideRouter, NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';
import {Component, ElementRef} from "@angular/core";
import {Location, LocationStrategy} from '@angular/common';
import {FirstComponent} from "./first.component";
import {SecondComponent} from "./second.component";

@Component({
    selector: "multi-page-main",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
    <Label text="Multi-page router"></Label>
    <page-router-outlet></page-router-outlet>
    `

})
export class MultiPageMain {
    constructor(
        public elementRef: ElementRef,
        public router: Router,
        public location: LocationStrategy) {
    }
}

const routes: RouterConfig = [
    { path: "", redirectTo: "first/multi-page", terminal: true },
    { path: "first/:id", component: FirstComponent },
    { path: "second/:id", component: SecondComponent },
];
export const MultiPageRouterProviders = [
    nsProvideRouter(routes, { enableTracing: false })
];