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

export { NSRouterLink } from "./ns-router-link";
export { NSRouterLinkActive } from "./ns-router-link-active";
export { PageRoute } from "./page-router-outlet";
export { RouterExtensions } from "./router-extensions";
export { NSModuleFactoryLoader } from "./ns-module-factory-loader";
export { NSEmptyOutletComponent } from "./ns-empty-outlet.component";

export type LocationState = LocationState;

const ROUTER_DIRECTIVES = [NSRouterLink, NSRouterLinkActive, PageRouterOutlet, NSEmptyOutletComponent];

const NS_ROUTER_PROVIDERS = [
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
];

@NgModule({
    declarations: ROUTER_DIRECTIVES,
    entryComponents: [NSEmptyOutletComponent],
    imports: [RouterModule, NativeScriptCommonModule],
    exports: [RouterModule, ...ROUTER_DIRECTIVES],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders<NativeScriptRouterModule> {
        return {
            ngModule: NativeScriptRouterModule,
            providers: [...RouterModule.forRoot(routes, config).providers, ...NS_ROUTER_PROVIDERS]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders<NativeScriptRouterModule> {
        return { ngModule: NativeScriptRouterModule, providers: RouterModule.forChild(routes).providers };
    }
}

export function provideLocationStrategy(
    locationStrategy: NSLocationStrategy,
    frameService: FrameService
): NSLocationStrategy {
    return locationStrategy ? locationStrategy : new NSLocationStrategy(frameService);
}
