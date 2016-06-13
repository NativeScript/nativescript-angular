import {Type} from '@angular/core/src/facade/lang';
import {NSRouterLink} from './ns-router-link';
import {PageRouterOutlet} from './page-router-outlet';
import {NSLocationStrategy} from '../router/ns-location-strategy';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LocationStrategy} from '@angular/common';
import {provide} from '@angular/core';
export {routerTraceCategory} from "../trace";

export const NS_ROUTER_PROVIDERS: any[] = [
    ROUTER_PROVIDERS,
    NSLocationStrategy,
    provide(LocationStrategy, {useExisting: NSLocationStrategy}),
];

export const NS_ROUTER_DIRECTIVES: Type[] = [
    NSRouterLink,
    PageRouterOutlet
];
