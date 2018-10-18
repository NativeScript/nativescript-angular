import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import {
    AppRoutingModule,
    navigatableComponents,
} from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ItemsService } from "./items.service";

import { rendererTraceCategory, viewUtilCategory, bootstrapCategory } from "nativescript-angular/trace";
import { addCategories, enable, categories } from "tns-core-modules/trace";
addCategories(bootstrapCategory);
addCategories(rendererTraceCategory);
addCategories(viewUtilCategory);
addCategories(categories.ViewHierarchy);
enable();

export class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("### ErrorHandler Error: " + error.toString());
        console.log("### ErrorHandler Stack: " + error.stack);
    }
}  


@NgModule({
    declarations: [
        AppComponent,
        ...navigatableComponents,
    ],
    bootstrap: [AppComponent],
    providers: [
        ItemsService,
        { provide: ErrorHandler, useClass: MyErrorHandler }
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

