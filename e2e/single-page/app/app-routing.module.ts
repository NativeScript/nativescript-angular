import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular/router";

import { FirstComponent } from "./first/first.component"
import { SecondComponent } from "./second/second.component"

export const routes = [
    {
        path: "",
        redirectTo: "/first",
        pathMatch: "full"
    },
    {
        path: "first",
        component: FirstComponent,
    },
    {
        path: "second/:id", component: SecondComponent,
    },
];

export const navigatableComponents = [
    FirstComponent,
    SecondComponent,
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }

