import {Type} from '@angular/core/src/facade/lang';
import {provide} from '@angular/core';
import {LocationStrategy, PlatformLocation} from '@angular/common';
import { RouterConfig } from '@angular/router';
import { provideRouter, ExtraOptions } from '@angular/router/src/common_router_providers';

import {NSRouterLink} from './ns-router-link';
import {PageRouterOutlet} from './page-router-outlet';
import {NSLocationStrategy} from './ns-location-strategy';
import {NativescriptPlatformLocation} from './ns-platform-location';

export {routerTraceCategory} from "../trace";

export const NS_ROUTER_PROVIDERS: any[] = [
    NSLocationStrategy,
    provide(LocationStrategy, { useExisting: NSLocationStrategy }),

    NativescriptPlatformLocation,
    provide(PlatformLocation, { useClass: NativescriptPlatformLocation }),
];

export const NS_ROUTER_DIRECTIVES: Type[] = [
    NSRouterLink,
    PageRouterOutlet
];

export function nsProvideRouter(config: RouterConfig, opts: ExtraOptions): any[] {
    return [
        ...NS_ROUTER_PROVIDERS,
        ...provideRouter(config, opts) // NOTE: use provideRouter form common_router_providers - it doesnt include BrowserPlatformLocation
    ];
};