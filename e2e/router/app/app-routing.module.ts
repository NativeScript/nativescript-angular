import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { FirstComponent } from "./first/first.component"
import { SecondComponent } from "./second/second.component"
import { MasterComponent } from "./second/master.component"
import { DetailComponent } from "./second/detail.component"

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
        path: "second/:depth", component: SecondComponent,
        children: [
            { path: "", component: MasterComponent },
            { path: "detail/:id", component: DetailComponent }
        ]
    },
    {
        path: "c-less",
        children: [
            {
                path: "deep/:depth",
                component: SecondComponent,
                children: [
                    { path: "", component: MasterComponent },
                    { path: "detail/:id", component: DetailComponent }
                ]
            }
        ]
    },
    {
        path: "lazy",
        loadChildren: "./lazy/lazy.module#LazyModule",
    }
];

export const navigatableComponents = [
    FirstComponent,
    SecondComponent,
    MasterComponent,
    DetailComponent
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }

