import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";

import "./polyfills/array";
import "./polyfills/console";

import {
    ApplicationModule,
    ErrorHandler,
    NO_ERRORS_SCHEMA,
    NgModule,
    RendererFactory2,
    SystemJsNgModuleLoader,
    Optional,
    SkipSelf,
    ɵINJECTOR_SCOPE,
} from "@angular/core";

import {
    ViewportScroller,
    ɵNullViewportScroller as NullViewportScroller,
} from "@angular/common";

import { NativeScriptCommonModule } from "./common";
import { NativeScriptRendererFactory } from "./renderer";
import { DetachedLoader } from "./common/detached-loader";
import { throwIfAlreadyLoaded } from "./common/utils";
import { FrameService, PageService } from "./platform-providers";

export function errorHandlerFactory() {
    return new ErrorHandler();
}

export { DetachedLoader };

@NgModule({
    declarations: [
        DetachedLoader,
    ],
    providers: [
        FrameService,
        PageService,
        NativeScriptRendererFactory,
        SystemJsNgModuleLoader,
        { provide: ɵINJECTOR_SCOPE, useValue: "root" },
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
