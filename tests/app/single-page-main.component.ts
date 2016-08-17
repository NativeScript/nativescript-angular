import {ROUTER_DIRECTIVES, Router, RouterConfig } from '@angular/router';
import {nsProvideRouter} from 'nativescript-angular/router';
import {Component, ElementRef} from "@angular/core";
import {Location, LocationStrategy} from '@angular/common';
import {FirstComponent} from "./first.component";
import {SecondComponent} from "./second.component";

@Component({
    selector: "single-page-main",
    directives: [ROUTER_DIRECTIVES],
    template: `
    <Label text="Single-page router"></Label>
    <router-outlet></router-outlet>
    `

})
export class SinglePageMain {
    constructor(
        public elementRef: ElementRef,
        public router: Router,
        public location: LocationStrategy) {
    }
}

export const routes = [
    { path: "", redirectTo: "first/single-page", terminal: true },
    { path: "first/:id", component: FirstComponent },
    { path: "second/:id", component: SecondComponent },
];
