import {
    ApplicationModule,
    ErrorHandler,
    NO_ERRORS_SCHEMA,
    NgModule,
    RendererFactory2,
    SystemJsNgModuleLoader,
    Optional,
    SkipSelf,
    ɵAPP_ROOT as APP_ROOT,
} from "@angular/core";

import {
    ViewportScroller,
    ɵNullViewportScroller as NullViewportScroller,
} from "@angular/common";

import { NativeScriptCommonModule, DetachedLoader, } from "nativescript-angular/common";
import { throwIfAlreadyLoaded } from "nativescript-angular/core";
import { NativeScriptRendererFactory } from "./renderer";
import { FrameService } from "nativescript-angular/core";

export function errorHandlerFactory() {
    return new ErrorHandler();
}

@NgModule({
    declarations: [
        DetachedLoader,
    ],
    providers: [
        FrameService,
        NativeScriptRendererFactory,
        SystemJsNgModuleLoader,
        { provide: APP_ROOT, useValue: true },
        { provide: ErrorHandler, useFactory: errorHandlerFactory },
        { provide: RendererFactory2, useExisting: NativeScriptRendererFactory },
        { provide: ViewportScroller, useClass: NullViewportScroller },
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
    constructor(@Optional() @SkipSelf() parentModule: NativeScriptModule) {
        // Prevents NativeScriptModule from getting imported multiple times
        throwIfAlreadyLoaded(parentModule, "NativeScriptModule");
    }
}
