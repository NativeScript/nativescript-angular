import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Route } from "@angular/router";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NestedMasterComponent } from "./nested-master.component"
import { NestedDetailComponent } from "./nested-detail.component"

const routes: Route[] = [
    { path: "", component: NestedMasterComponent },
    { path: "detail/:id", component: NestedDetailComponent }
];

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes)
    ],
    declarations: [
        NestedMasterComponent,
        NestedDetailComponent
    ],
    exports:[
        NestedMasterComponent,
        NestedDetailComponent
    ]
})
export class LazyNamedModule { }