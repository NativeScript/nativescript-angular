import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Route } from "@angular/router";

import { NativeScriptCommonModule, NativeScriptRouterModule } from "@nativescript/angular";

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
        NativeScriptRouterModule,
        NestedMasterComponent,
        NestedDetailComponent
    ]
})
export class LazyNamedModule { }