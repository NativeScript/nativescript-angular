import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router/ns-router";
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
@RouteConfig([
    { path: '/first', name: 'First', component: FirstComponent, useAsDefault: true , data: {id: "multi-page"}},
    { path: '/second', name: 'Second', component: SecondComponent, data: {id: "multi-page"} }
])
export class MultiPageMain {
    constructor(
        public elementRef: ElementRef,
        public router: Router,
        public location: LocationStrategy) {
    }
}
