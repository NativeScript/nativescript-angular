// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NavigationMainPageRouter } from "./main/main-page-router-outlet";
import { routableComponents, routes } from "./app.routes";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NestedComponent } from "./action-bar/action-bar-nested.component";
import { CustomTemplate } from "./listView/customTemplate/list-view-item-template";

@NgModule({
    declarations: [
        NavigationMainPageRouter,
        NestedComponent,
        CustomTemplate,
        ...routableComponents
    ],
    bootstrap: [NavigationMainPageRouter],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
    ],
})
class AppComponentModule { }

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);
