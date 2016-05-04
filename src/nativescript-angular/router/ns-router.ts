import {Type} from '@angular/core/src/facade/lang';
import {NSRouterLink} from './ns-router-link';
import {PageRouterOutlet} from './page-router-outlet';
import {NSLocationStrategy} from './ns-location-strategy';
import {ROUTER_PROVIDERS} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {provide} from '@angular/core';
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
