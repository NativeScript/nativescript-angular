import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NSModuleFactoryLoader } from "nativescript-angular/router";
 import { isNavigationButton } from "nativescript-angular/directives/action-bar";

import {
    AppRoutingModule,
    navigatableComponents,
} from "./app-routing.module";

import { AppComponent } from "./app.component";

import { routeReuseStrategyTraceCategory, routerTraceCategory } from "nativescript-angular/trace";
import { setCategories, enable } from "tns-core-modules/trace";
import { ModalComponent } from "./second/modal/modal.component";
setCategories(routerTraceCategory + "," + routeReuseStrategyTraceCategory);
enable();

@NgModule({
    declarations: [
        AppComponent,
        ModalComponent,
        ...navigatableComponents,
    ],
    entryComponents:[
        ModalComponent
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

