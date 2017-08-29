import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ListComponent } from "./list.component";
import { NgForComponent } from "./ngfor.component";
import { NgForOfComponent } from "./ngforof.component";
import { NgIfNoLayoutComponent } from "./ngif-no-layout.component";
import { NgIfInbetweenComponent } from "./ngif-inbetween.component";
import { NgIfElseComponent } from "./ngifelse.component";
import { NgIfThenElseComponent } from "./ngif-then-else.component";
import { NgIfSubsequent } from "./ngif-subsequent.component";
import { ContentViewComponent } from "./content-view.component";

export const routes = [
    {
        path: "",
        redirectTo: "/list",
        pathMatch: "full"
    },
    {
        path: "list",
        component: ListComponent,
    },
    {
        path: "ngfor",
        component: NgForComponent,
    },
    {
        path: "ngforof",
        component: NgForOfComponent,
    },
    {
        path: "ngif-no-layout",
        component: NgIfNoLayoutComponent,
    },
    {
        path: "ngif-inbetween",
        component: NgIfInbetweenComponent,
    },
    {
        path: "ngifelse",
        component: NgIfElseComponent,
    },
    {
        path: "ngif-then-else",
        component: NgIfThenElseComponent,
    },
    {
        path: "ngif-subsequent",
        component: NgIfSubsequent,
    },
    {
        path: "content-view",
        component: ContentViewComponent,
    },
];

export const navigatableComponents = [
    ListComponent,
    NgForComponent,
    NgForOfComponent,
    NgIfNoLayoutComponent,
    NgIfInbetweenComponent,
    NgIfElseComponent,
    NgIfThenElseComponent,
    NgIfSubsequent,
    ContentViewComponent,
];

@NgModule({
    imports: [ NativeScriptRouterModule.forRoot(routes) ],
    exports: [ NativeScriptRouterModule ],
})
export class AppRoutingModule { }

