import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular/router";
import { NativeScriptCommonModule } from "@nativescript/angular/common";
import { NestedPageComponent } from "./page-router-outlet/nested-page.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule
    ],
    declarations:[NestedPageComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }