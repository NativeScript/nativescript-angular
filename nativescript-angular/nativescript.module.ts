import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";

import "reflect-metadata";
import "./polyfills/array";
import "./polyfills/console";

import { CommonModule } from "@angular/common";
import { NativeScriptRendererFactory } from "./renderer";
import { DetachedLoader } from "./common/detached-loader";
import { ModalDialogHost, ModalDialogService } from "./directives/dialogs";
import {
    ApplicationModule,
    ErrorHandler,
    RendererFactory2,
    NgModule, NO_ERRORS_SCHEMA,
} from "@angular/core";
import {
    defaultPageProvider,
    defaultFrameProvider,
    defaultDeviceProvider
} from "./platform-providers";
import { NS_DIRECTIVES } from "./directives";

export function errorHandlerFactory() {
    return new ErrorHandler(true);
};

@NgModule({
    declarations: [
        DetachedLoader,
        ModalDialogHost,
        ...NS_DIRECTIVES,
    ],
    providers: [
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        defaultFrameProvider,
        defaultPageProvider,
        defaultDeviceProvider,
        NativeScriptRendererFactory,
        { provide: RendererFactory2, useClass: NativeScriptRendererFactory },
        ModalDialogService
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
