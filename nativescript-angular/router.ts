import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from "@angular/router";
import { LocationStrategy, PlatformLocation } from "@angular/common";
import { NSRouterLink } from "./router/ns-router-link";
import { NSRouterLinkActive } from "./router/ns-router-link-active";
import { PageRouterOutlet } from "./router/page-router-outlet";
import { NSLocationStrategy, LocationState } from "./router/ns-location-strategy";
import { NativescriptPlatformLocation } from "./router/ns-platform-location";
import { RouterExtensions } from "./router/router-extensions";
import { NativeScriptModule } from "./nativescript.module";

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
        NSLocationStrategy,
        { provide: LocationStrategy, useExisting: NSLocationStrategy },
        NativescriptPlatformLocation,
        { provide: PlatformLocation, useClass: NativescriptPlatformLocation },
        RouterExtensions
    ],
    imports: [
        RouterModule,
        NativeScriptModule
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
