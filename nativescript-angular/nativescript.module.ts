import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";

import "reflect-metadata";
import "./polyfills/array";
import "./polyfills/console";

import {
    ApplicationModule,
    ErrorHandler,
    NO_ERRORS_SCHEMA,
    NgModule,
    RendererFactory2,
    SystemJsNgModuleLoader,
} from "@angular/core";

import { NativeScriptCommonModule } from "./common";
import { NativeScriptRendererFactory } from "./renderer";
import { DetachedLoader } from "./common/detached-loader";

export function errorHandlerFactory() {
    return new ErrorHandler(true);
}

@NgModule({
    declarations: [
        DetachedLoader,
    ],
    providers: [
        NativeScriptRendererFactory,
        SystemJsNgModuleLoader,
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        { provide: RendererFactory2, useExisting: NativeScriptRendererFactory },
    ],
    entryComponents: [
        DetachedLoader,
    ],
    imports: [
        ApplicationModule,
        NativeScriptCommonModule,
    ],
    exports: [
        ApplicationModule,
        NativeScriptCommonModule,
        DetachedLoader,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NativeScriptModule {
}
