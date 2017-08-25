import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import {
    AppRoutingModule,
    navigatableComponents,
} from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ItemsService } from "./items.service";

import { rendererTraceCategory, viewUtilCategory } from "nativescript-angular/trace";
import { setCategories, enable } from "trace";
setCategories(rendererTraceCategory + "," + viewUtilCategory);
enable();

@NgModule({
    declarations: [
        AppComponent,
        ...navigatableComponents,
    ],
    bootstrap: [AppComponent],
    providers: [
        ItemsService 
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

