import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { NavigationMainPageRouterComponent } from "./main/main-page-router-outlet";
import { routableComponents, routes } from "./app.routes";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NestedComponent } from "./action-bar/action-bar-nested.component";
import { CustomTemplateComponent } from "./list-view/list-view-item-template.component";

@NgModule({
    declarations: [
        NavigationMainPageRouterComponent,
        NestedComponent,
        CustomTemplateComponent,
        ...routableComponents,
    ],
    bootstrap: [NavigationMainPageRouterComponent],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
