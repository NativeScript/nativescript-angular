import {Type} from 'angular2/src/facade/lang';
import {NSRouterLink} from './ns-router-link';
import {PageRouterOutlet} from './page-router-outlet';
import {LocationStrategy} from 'angular2/platform/common';
import {NSLocationStrategy} from './ns-location-strategy';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {provide} from 'angular2/core';
import { CATEGORY } from "./common";

export const NS_ROUTER_PROVIDERS: any[] = [
    ROUTER_PROVIDERS,
    NSLocationStrategy,
    provide(LocationStrategy, {useExisting: NSLocationStrategy}),
];

export const NS_ROUTER_DIRECTIVES: Type[] = [
    NSRouterLink,
    PageRouterOutlet
];

export const routerTraceCategory = CATEGORY;