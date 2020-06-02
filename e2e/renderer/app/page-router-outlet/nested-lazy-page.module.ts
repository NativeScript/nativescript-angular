import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular/router";
import { NativeScriptCommonModule } from "@nativescript/angular/common";
import { SharedModule } from "~/shared.module";
import { NestedPageComponent } from "./nested-page.component";

@NgModule({
    imports: [
        SharedModule,
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", component: NestedPageComponent }
        ])
    ],
    providers: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NestedLazyPageModule { }