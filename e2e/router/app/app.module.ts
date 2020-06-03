import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";
import { NSModuleFactoryLoader } from "@nativescript/angular/router";

import {
    AppRoutingModule,
    navigatableComponents,
} from "./app-routing.module";

import { AppComponent } from "./app.component";

import { rendererTraceCategory, viewUtilCategory, routeReuseStrategyTraceCategory, routerTraceCategory } from "@nativescript/angular/trace";
import { setCategories, enable } from "@nativescript/core/trace";
setCategories(routerTraceCategory + "," + routeReuseStrategyTraceCategory);
enable();

@NgModule({
    declarations: [
        AppComponent,
        ...navigatableComponents,
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

