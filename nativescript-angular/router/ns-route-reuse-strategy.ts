import { Injectable } from "@angular/core";
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";

import { routeReuseStrategyLog as log, isLogEnabled } from "../trace";
import { NSLocationStrategy } from "./ns-location-strategy";
import {
    destroyComponentRef,
    findTopActivatedRouteNodeForOutlet,
    pageRouterActivatedSymbol
} from "./page-router-outlet";

interface CacheItem {
    key: string;
    state: DetachedRouteHandle;
    isModal: boolean;
}

/**
 * Detached state cache
 */
class DetachedStateCache {
    private cache = new Array<CacheItem>();

    public get length(): number {
        return this.cache.length;
    }

    public push(cacheItem: CacheItem) {
        this.cache.push(cacheItem);
    }

    public pop(): CacheItem {
        return this.cache.pop();
    }

    public peek(): CacheItem {
        return this.cache[this.cache.length - 1];
    }

    public clear() {
        if (isLogEnabled()) {
            log(`DetachedStateCache.clear() ${this.cache.length} items will be destroyed`);
        }

        while (this.cache.length > 0) {
            const state = <any>this.cache.pop().state;
            if (!state.componentRef) {
                throw new Error("No componentRed found in DetachedRouteHandle");
            }

            destroyComponentRef(state.componentRef);
        }
    }

    public clearModalCache() {
        let removedItemsCount = 0;
        const hasModalPages = this.cache.some(cacheItem => {
            return cacheItem.isModal;
        });

        if (hasModalPages) {
            let modalCacheCleared = false;

            while (!modalCacheCleared) {
                let cacheItem = this.peek();
                const state = <any>cacheItem.state;

                if (!state.componentRef) {
                    throw new Error("No componentRef found in DetachedRouteHandle");
                }

                destroyComponentRef(state.componentRef);
                if (cacheItem.isModal) {
                    modalCacheCleared = true;
                }

                this.pop();
                removedItemsCount++;
            }
        }

        if (isLogEnabled()) {
            log(`DetachedStateCache.clearModalCache() ${removedItemsCount} items will be destroyed`);
        }
    }
}

/**
 * Detaches subtrees loaded inside PageRouterOutlet in forward navigation
 * and reattaches them on back.
 * Reuses routes as long as their route config is the same.
 */
@Injectable()
export class NSRouteReuseStrategy implements RouteReuseStrategy {
    private cacheByOutlet: { [key: string]: DetachedStateCache } = {};

    constructor(private location: NSLocationStrategy) { }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        const isPageActivated = route[pageRouterActivatedSymbol];
        const isBack = this.location._isPageNavigatingBack();
        const shouldDetach = !isBack && isPageActivated;

        if (isLogEnabled()) {
            log(`shouldDetach isBack: ${isBack} key: ${key} result: ${shouldDetach}`);
        }

        return shouldDetach;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        route = findTopActivatedRouteNodeForOutlet(route);

        const cache = this.cacheByOutlet[route.outlet];
        if (!cache) {
            return false;
        }

        const key = getSnapshotKey(route);
        const isBack = this.location._isPageNavigatingBack();
        const shouldAttach = isBack && cache.peek().key === key;

        if (isLogEnabled()) {
            log(`shouldAttach isBack: ${isBack} key: ${key} result: ${shouldAttach}`);
        }

        return shouldAttach;
    }

    store(route: ActivatedRouteSnapshot, state: DetachedRouteHandle): void {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        if (isLogEnabled()) {
            log(`store key: ${key}, state: ${state}`);
        }

        const cache = this.cacheByOutlet[route.outlet] = this.cacheByOutlet[route.outlet] || new DetachedStateCache();

        if (state) {
            let isModal = false;
            if (this.location._isModalNavigation) {
                isModal = true;
                this.location._isModalNavigation = false;
            }

            cache.push({ key, state, isModal });
        } else {
            const topItem = cache.peek();
            if (topItem.key === key) {
                cache.pop();
            } else {
                throw new Error("Trying to pop from DetachedStateCache but keys don't match. " +
                    `expected: ${topItem.key} actual: ${key}`);
            }
        }
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        route = findTopActivatedRouteNodeForOutlet(route);

        const cache = this.cacheByOutlet[route.outlet];
        if (!cache) {
            return null;
        }

        const key = getSnapshotKey(route);
        const isBack = this.location._isPageNavigatingBack();
        const cachedItem = cache.peek();

        let state = null;
        if (isBack && cachedItem && cachedItem.key === key) {
            state = cachedItem.state;
        }

        if (isLogEnabled()) {
            log(`retrieved isBack: ${isBack} key: ${key} state: ${state}`);
        }

        return state;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const shouldReuse = future.routeConfig === curr.routeConfig;

        if (shouldReuse && curr && curr[pageRouterActivatedSymbol]) {
            // When reusing route - copy the pageRouterActivated to the new snapshot
            // It's needed in shouldDetach to determine if the route should be detached.
            future[pageRouterActivatedSymbol] = curr[pageRouterActivatedSymbol];
        }

        if (isLogEnabled()) {
            log(`shouldReuseRoute result: ${shouldReuse}`);
        }

        return shouldReuse;
    }

    clearCache(outletName: string) {
        const cache = this.cacheByOutlet[outletName];

        if (cache) {
            cache.clear();
        }
    }

    clearModalCache(outletName: string) {
        const cache = this.cacheByOutlet[outletName];

        if (cache) {
            cache.clearModalCache();
        }
    }
}

function getSnapshotKey(snapshot: ActivatedRouteSnapshot): string {
    return snapshot.pathFromRoot.join("->");
}
