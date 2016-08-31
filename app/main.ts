// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NavigationMainPageRouter, routes, routableComponents } from "./main/main-page-router-outlet";
import { NativeScriptRouterModule } from "nativescript-angular/router";

@NgModule({
    declarations: [
        NavigationMainPageRouter,
        ...routableComponents
    ],
    bootstrap: [NavigationMainPageRouter],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
    ],
})
class AppComponentModule { }

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);
