import {
    NgModule,
    ModuleWithProviders,
    NO_ERRORS_SCHEMA,
    Optional,
    SkipSelf,
} from "@angular/core";
import { RouterModule, Routes, ExtraOptions, RouteReuseStrategy } from "@angular/router";
import { LocationStrategy, PlatformLocation } from "@angular/common";
import { Frame } from "tns-core-modules/ui/frame";
import { NSRouterLink } from "./ns-router-link";
import { NSRouterLinkActive } from "./ns-router-link-active";
import { PageRouterOutlet } from "./page-router-outlet";
import { NSLocationStrategy, LocationState } from "./ns-location-strategy";
import { NativescriptPlatformLocation } from "./ns-platform-location";
import { NSRouteReuseStrategy } from "./ns-route-reuse-strategy";
import { RouterExtensions } from "./router-extensions";
import { NativeScriptCommonModule } from "../common";

export { PageRoute } from "./page-router-outlet";
export { RouterExtensions } from "./router-extensions";
export { NSModuleFactoryLoader } from "./ns-module-factory-loader";
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
        NSRouteReuseStrategy,
        { provide: RouteReuseStrategy, useExisting: NSRouteReuseStrategy }
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
