import {
    NgModule,
    NO_ERRORS_SCHEMA,
    NgModuleFactoryLoader
} from "@angular/core";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { NSModuleFactoryLoader } from "nativescript-angular/router";

import { AppRoutingModule, routedComponents } from "./app.routing";
import { AppComponent } from "./app.component";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    declarations: [
        AppComponent,
        ...routedComponents,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptAnimationsModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader},
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
