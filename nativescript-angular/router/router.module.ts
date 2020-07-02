import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA, Optional, SkipSelf } from '@angular/core';
import { RouterModule, Routes, ExtraOptions, RouteReuseStrategy } from '@angular/router';
import { LocationStrategy, PlatformLocation } from '@angular/common';
import { NSRouterLink } from './ns-router-link';
import { NSRouterLinkActive } from './ns-router-link-active';
import { PageRouterOutlet } from './page-router-outlet';
import { NSLocationStrategy } from './ns-location-strategy';
import { NativescriptPlatformLocation } from './ns-platform-location';
import { NSRouteReuseStrategy } from './ns-route-reuse-strategy';
import { RouterExtensions } from './router-extensions';
import { NativeScriptCommonModule } from '../common';
import { FrameService } from '../frame.service';
import { NSEmptyOutletComponent } from './ns-empty-outlet.component';

export { PageRoute } from './page-router-outlet';
export { RouterExtensions } from './router-extensions';
export { NSModuleFactoryLoader } from './ns-module-factory-loader';

export { NSRouterLink, NSRouterLinkActive, PageRouterOutlet, NSEmptyOutletComponent, NSLocationStrategy };

export function provideLocationStrategy(
  locationStrategy: NSLocationStrategy,
  frameService: FrameService
): NSLocationStrategy {
  return locationStrategy ? locationStrategy : new NSLocationStrategy(frameService);
}

@NgModule({
    declarations: [
      NSRouterLink, NSRouterLinkActive, PageRouterOutlet, NSEmptyOutletComponent
    ],
    entryComponents: [NSEmptyOutletComponent],
    imports: [RouterModule, NativeScriptCommonModule],
    exports: [RouterModule, NSRouterLink, NSRouterLinkActive, PageRouterOutlet, NSEmptyOutletComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NativeScriptRouterModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders<NativeScriptRouterModule> {
        return {
            ngModule: NativeScriptRouterModule,
            providers: [
              ...RouterModule.forRoot(routes, config).providers,
              {
                provide: NSLocationStrategy,
                useFactory: provideLocationStrategy,
                deps: [[NSLocationStrategy, new Optional(), new SkipSelf()], FrameService],
              },
              { provide: LocationStrategy, useExisting: NSLocationStrategy },
              NativescriptPlatformLocation,
              { provide: PlatformLocation, useExisting: NativescriptPlatformLocation },
              RouterExtensions,
              NSRouteReuseStrategy,
              { provide: RouteReuseStrategy, useExisting: NSRouteReuseStrategy }
            ]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders<NativeScriptRouterModule> {
        return { ngModule: NativeScriptRouterModule, providers: RouterModule.forChild(routes).providers };
    }
}
