import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";

import "reflect-metadata";
import "./polyfills/array";
import "./polyfills/console";

import { CommonModule } from "@angular/common";
import {
    ApplicationModule,
    ErrorHandler,
    NO_ERRORS_SCHEMA,
    NgModule,
    RendererFactory2,
    SystemJsNgModuleLoader,
} from "@angular/core";

import { NativeScriptRendererFactory } from "./renderer";
import { DetachedLoader } from "./common/detached-loader";
import {
    ModalDialogHost,
    ModalDialogService,
} from "./directives/dialogs";
import {
    defaultDeviceProvider,
    defaultFrameProvider,
    defaultPageProvider,
} from "./platform-providers";
import { NS_DIRECTIVES } from "./directives";

export function errorHandlerFactory() {
    return new ErrorHandler(true);
}

@NgModule({
    declarations: [
        DetachedLoader,
        ModalDialogHost,
        ...NS_DIRECTIVES,
    ],
    providers: [
        ModalDialogService,
        NativeScriptRendererFactory,
        SystemJsNgModuleLoader,
        defaultDeviceProvider,
        defaultFrameProvider,
        defaultPageProvider,
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        { provide: RendererFactory2, useClass: NativeScriptRendererFactory },
    ],
    entryComponents: [
        DetachedLoader,
    ],
    imports: [
        CommonModule,
        ApplicationModule,
    ],
    exports: [
        CommonModule,
        ApplicationModule,
        DetachedLoader,
        ModalDialogHost,
        ...NS_DIRECTIVES,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NativeScriptModule {
}
