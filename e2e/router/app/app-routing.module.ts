import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "@nativescript/angular";

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
        path: "second/:depth",
        component: SecondComponent,
        children: [
            { path: "", component: MasterComponent },
            { path: "detail/:id", component: DetailComponent },
            {
                path: "lazy-named",
                outlet: "lazyNameOutlet",
                component: NSEmptyOutletComponent,
                loadChildren: () => import('./lazy-named/lazy-named.module').then(m => m.LazyNamedModule),
            }
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
        component: NSEmptyOutletComponent,
        loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
    }
];

@NgModule({
    imports: [NativeScriptRouterModule, NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }

