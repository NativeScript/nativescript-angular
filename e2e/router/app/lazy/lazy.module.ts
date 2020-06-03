import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Route } from "@angular/router";

import { NativeScriptCommonModule } from "@nativescript/angular/common";
import { NativeScriptRouterModule } from "@nativescript/angular/router";

import { LazyComponent } from "./lazy.component";
import { LazyComponentlessRouteComponent } from "./lazy-componentless-route.component";

const routes: Route[] = [
    {
        path: "home",
        component: LazyComponent
    },
    {
        path: "nest",
        children: [
            {
                path: "more",
                component: LazyComponentlessRouteComponent
            }
        ]
    }
];

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes)
    ],
    declarations: [
        LazyComponent,
        LazyComponentlessRouteComponent
    ]
})
export class LazyModule { }