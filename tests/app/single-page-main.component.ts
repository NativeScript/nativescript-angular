import {Router} from '@angular/router';
import {Component, ElementRef} from "@angular/core";
import {Location, LocationStrategy} from '@angular/common';
import {FirstComponent} from "./first.component";
import {SecondComponent} from "./second.component";

@Component({
    selector: "single-page-main",
    template: `
    <ListView [items]="['lqlq', 'shalqlq']" class="list-group">
        <ng-template let-item="item" let-odd="odd" let-even="even">
          <StackLayout>
            <Label [text]="item" class="list-group-item"></Label>
          </StackLayout>
        </ng-template>
    </ListView>

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
    { path: "", redirectTo: "first/single-page", pathMatch: "full", terminal: true },
    { path: "first/:id", component: FirstComponent },
    { path: "second/:id", component: SecondComponent },
];
