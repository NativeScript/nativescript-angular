import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule, NativeScriptAnimationsModule } from "@nativescript/angular";

import {
    AppRoutingModule,
} from "./app-routing.module";
import { FirstComponent } from "./first/first.component"
import { SecondComponent } from "./second/second.component"
import { MasterComponent } from "./second/master.component"
import { DetailComponent } from "./second/detail.component"

import { AppComponent } from "./app.component";

import { rendererTraceCategory, viewUtilCategory, routeReuseStrategyTraceCategory, routerTraceCategory } from "@nativescript/angular/trace";
import { setCategories, enable } from "@nativescript/core/trace";
setCategories(routerTraceCategory + "," + routeReuseStrategyTraceCategory);
enable();

@NgModule({
    declarations: [
        AppComponent,
        FirstComponent,
        SecondComponent,
        MasterComponent,
        DetailComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        // NativeScriptAnimationsModule,
        AppRoutingModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

