import {Router} from "@angular/router";
import {Component, ElementRef} from "@angular/core";
import {Location, LocationStrategy} from "@angular/common";
import {FirstComponent} from "./first.component";
import {SecondComponent} from "./second.component";

@Component({
    selector: "single-page-main",
    template: `
    <Frame>
        <Page>
            <StackLayout>
                <Label text="Single-page router"></Label>
                <router-outlet></router-outlet>
            </StackLayout>
        </Page>
    </Frame>
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
    { path: "", redirectTo: "first/single-page", pathMatch: "full", terminal: true },
    { path: "first/:id", component: FirstComponent },
    { path: "second/:id", component: SecondComponent },
];
