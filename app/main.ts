// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NavigationMainPageRouter, routes, routableComponents } from "./main/main-page-router-outlet";
import { NestedComponent } from "./action-bar/action-bar-nested.component";
import { CustomTemplate } from "./listView/customTemplate/list-view-item-template";
import { ModalContent } from "./modal/modal-dialog.component";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
    declarations: [
        NavigationMainPageRouter,
        NestedComponent,
        CustomTemplate,
        ModalContent,
        ...routableComponents
    ],
    entryComponents: [
        ModalContent,
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
