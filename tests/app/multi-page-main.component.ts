import {Router} from '@angular/router';
import {Component, ElementRef} from "@angular/core";
import {Location, LocationStrategy} from '@angular/common';
import {FirstComponent} from "./first.component";
import {SecondComponent} from "./second.component";

@Component({
    selector: "multi-page-main",
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

export const routes = [
    { path: "", redirectTo: "first/multi-page", pathMatch: "full", terminal: true },
    { path: "first/:id", component: FirstComponent },
    { path: "second/:id", component: SecondComponent },
];
