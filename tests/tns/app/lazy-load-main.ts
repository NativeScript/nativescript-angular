import { Component } from "@angular/core";
import { FirstComponent } from "./first.component";

@Component({
    template: `
    <Label text="Lazy load router"></Label>
    <page-router-outlet></page-router-outlet>
    `
})
export class LazyLoadMain {
}

export const routes = [
    { path: "", redirectTo: "first/lazy-load", pathMatch: "full" },
    { path: "first/:id", component: FirstComponent },
    { path: "second", loadChildren: "./lazy-loaded.module#SecondModule" }
];
