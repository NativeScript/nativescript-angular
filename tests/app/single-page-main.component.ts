import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
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
@RouteConfig([
    { path: '/first', name: 'First', component: FirstComponent, useAsDefault: true , data: {id: "single-page"}},
    { path: '/second', name: 'Second', component: SecondComponent, data: {id: "single-page"} }
])
export class SinglePageMain {
    constructor(
        public elementRef: ElementRef,
        public router: Router,
        public location: LocationStrategy) {
    }
}
