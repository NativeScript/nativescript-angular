import { NgModule, ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { LocationStrategy, PlatformLocation } from '@angular/common';
import { NSRouterLink } from './router/ns-router-link';
import { NSRouterLinkActive } from './router/ns-router-link-active';
import { PageRouterOutlet } from './router/page-router-outlet';
import { NSLocationStrategy } from './router/ns-location-strategy';
import { NativescriptPlatformLocation } from './router/ns-platform-location';
import { RouterExtensions } from './router/router-extensions';
export { routerTraceCategory } from "./trace";
export { PageRoute } from './router/page-router-outlet';
export { RouterExtensions } from './router/router-extensions';

//TODO: delete after porting router examples.
export var nsProvideRouter: any = function(){};

@NgModule({
    declarations: [
        NSRouterLink,
        NSRouterLinkActive,
        PageRouterOutlet
    ],
    providers: [
        NSLocationStrategy,
        {provide: LocationStrategy, useExisting: NSLocationStrategy},
        NativescriptPlatformLocation,
        {provide: PlatformLocation, useClass: NativescriptPlatformLocation},
        RouterExtensions
    ],
    imports: [
        RouterModule
    ],
    exports: [
        RouterModule,
        NSRouterLink,
        NSRouterLinkActive,
        PageRouterOutlet
    ]
})
export class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders {
        return RouterModule.forRoot(routes, config);
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return RouterModule.forChild(routes);
    }                      
}
