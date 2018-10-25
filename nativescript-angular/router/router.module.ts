import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA, Optional, SkipSelf } from "@angular/core";
import { RouterModule, Routes, ExtraOptions, RouteReuseStrategy } from "@angular/router";
import { LocationStrategy, PlatformLocation } from "@angular/common";
import { NSRouterLink } from "./ns-router-link";
import { NSRouterLinkActive } from "./ns-router-link-active";
import { PageRouterOutlet } from "./page-router-outlet";
import { NSLocationStrategy, LocationState } from "./ns-location-strategy";
import { NativescriptPlatformLocation } from "./ns-platform-location";
import { NSRouteReuseStrategy } from "./ns-route-reuse-strategy";
import { RouterExtensions } from "./router-extensions";
import { NativeScriptCommonModule } from "../common";
import { FrameService } from "../platform-providers";
import { NSEmptyOutletComponent } from "./ns-empty-outlet.component";

export { PageRoute } from "./page-router-outlet";
export { RouterExtensions } from "./router-extensions";
export { NSModuleFactoryLoader } from "./ns-module-factory-loader";
export { NSEmptyOutletComponent } from "./ns-empty-outlet.component";

export type LocationState = LocationState;

@NgModule({
    declarations: [NSRouterLink, NSRouterLinkActive, PageRouterOutlet, NSEmptyOutletComponent],
    providers: [
        {
            provide: NSLocationStrategy,
            useFactory: provideLocationStrategy,
            deps: [[NSLocationStrategy, new Optional(), new SkipSelf()], FrameService],
        },
        { provide: LocationStrategy, useExisting: NSLocationStrategy },
        NativescriptPlatformLocation,
        { provide: PlatformLocation, useClass: NativescriptPlatformLocation },
        RouterExtensions,
        NSRouteReuseStrategy,
        { provide: RouteReuseStrategy, useExisting: NSRouteReuseStrategy },
    ],
    imports: [RouterModule, NativeScriptCommonModule],
    exports: [RouterModule, NSRouterLink, NSRouterLinkActive, PageRouterOutlet, NSEmptyOutletComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders {
        return RouterModule.forRoot(routes, config);
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return RouterModule.forChild(routes);
    }
}

export function provideLocationStrategy(
    locationStrategy: NSLocationStrategy,
    frameService: FrameService
): NSLocationStrategy {
    return locationStrategy ? locationStrategy : new NSLocationStrategy(frameService);
}
