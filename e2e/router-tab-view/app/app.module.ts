import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";
import { AppRoutingModule, COMPONENTS } from "./app.routing";
import { AppComponent } from "./app.component";

import { DataService } from "./data.service";

import { enable as traceEnable } from "@nativescript/core/trace";

// addCategories(routerTraceCategory);
traceEnable();

export class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("### ErrorHandler Error: " + error.toString());
        console.log("### ErrorHandler Stack: " + error.stack);
    }
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ...COMPONENTS
    ],
    providers: [
        DataService,
        { provide: ErrorHandler, useClass: MyErrorHandler }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }