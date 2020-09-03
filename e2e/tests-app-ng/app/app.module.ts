import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule, NativeScriptRouterModule, NativeScriptFormsModule } from "@nativescript/angular";

import { NavigationMainPageRouterComponent } from "./main/main-page-router-outlet";
import { routableComponents, routes } from "./app.routes";
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
