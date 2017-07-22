import {
    NgModule,
    ModuleWithProviders,
    NO_ERRORS_SCHEMA,
    Optional,
    SkipSelf,
} from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from "@angular/router";
import { LocationStrategy, PlatformLocation } from "@angular/common";
import { Frame } from "tns-core-modules/ui/frame";
import { NSRouterLink } from "./router/ns-router-link";
import { NSRouterLinkActive } from "./router/ns-router-link-active";
import { PageRouterOutlet } from "./router/page-router-outlet";
import { NSLocationStrategy, LocationState } from "./router/ns-location-strategy";
import { NativescriptPlatformLocation } from "./router/ns-platform-location";
import { RouterExtensions } from "./router/router-extensions";
import { NativeScriptCommonModule } from "./common";

export { PageRoute } from "./router/page-router-outlet";
export { RouterExtensions } from "./router/router-extensions";
export { NSModuleFactoryLoader } from "./router/ns-module-factory-loader";
export type LocationState = LocationState;

@NgModule({
    declarations: [
        NSRouterLink,
        NSRouterLinkActive,
        PageRouterOutlet
    ],
    providers: [
        {
            provide: NSLocationStrategy,
            useFactory: provideLocationStrategy,
            deps: [[NSLocationStrategy, new Optional(), new SkipSelf()], Frame]
        },
        { provide: LocationStrategy, useExisting: NSLocationStrategy },
        NativescriptPlatformLocation,
        { provide: PlatformLocation, useClass: NativescriptPlatformLocation },
        RouterExtensions,
    ],
    imports: [
        RouterModule,
        NativeScriptCommonModule,
    ],
    exports: [
        RouterModule,
        NSRouterLink,
        NSRouterLinkActive,
        PageRouterOutlet
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders {
        return RouterModule.forRoot(routes, config);
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return RouterModule.forChild(routes);
    }
}

export function provideLocationStrategy(locationStrategy: NSLocationStrategy, frame: Frame): NSLocationStrategy {
    return locationStrategy ? locationStrategy : new NSLocationStrategy(frame);
}
