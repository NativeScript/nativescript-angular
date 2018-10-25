import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule, COMPONENTS, MODALCOMPONENTS } from "./app.routing";
import { AppComponent } from "./app.component";

import { DataService } from "./data.service";
import { NSModuleFactoryLoader } from "nativescript-angular/router";

import { SharedModule } from "./shared.module";
import { enable as traceEnable, addCategories } from "tns-core-modules/trace";
import { routerTraceCategory } from "nativescript-angular/trace";

// addCategories(routerTraceCategory);
traceEnable();

class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("### ErrorHandler Error: " + error.toString());
        console.log("### ErrorHandler Stack: " + error.stack);
    }
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    entryComponents: [MODALCOMPONENTS],
    imports: [
        SharedModule,
        NativeScriptModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        ...COMPONENTS,
        MODALCOMPONENTS
    ],
    providers: [
        DataService,
        { provide: ErrorHandler, useClass: MyErrorHandler },
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }