import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NSModuleFactoryLoader } from "nativescript-angular/router";

import { NavigationMainPageRouter } from "./main/main-page-router-outlet";
import { routableComponents, routes } from "./app.routes";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NestedComponent } from "./action-bar/action-bar-nested.component";
import { CustomTemplate } from "./list-view/list-view-item-template.component";

@NgModule({
    declarations: [
        NavigationMainPageRouter,
        NestedComponent,
        CustomTemplate,
        ...routableComponents,
    ],
    bootstrap: [NavigationMainPageRouter],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
    ],
    providers: [
        {
            provide: NgModuleFactoryLoader,
            useClass: NSModuleFactoryLoader
        }
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

