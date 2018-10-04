import { Injectable } from "@angular/core";
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";

import { routeReuseStrategyLog as log } from "../trace";
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
        log(`DetachedStateCache.clear() ${this.cache.length} items will be destroyed`);

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

        log(`DetachedStateCache.clearModalCache() ${removedItemsCount} items will be destroyed`);
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

        const outletKey = this.location.getRouteFullPath(route);
        const outlet = this.location.findOutletByKey(outletKey);
        const key = getSnapshotKey(route);
        const isPageActivated = route[pageRouterActivatedSymbol];
        const isBack = outlet ? outlet.isPageNavigationBack : false;
        let shouldDetach = !isBack && isPageActivated;

        if (outlet) {
            if (outlet.parent && !outlet.parent.shouldDetach) {
                shouldDetach = false;
            }

            outlet.shouldDetach = shouldDetach;
        }

        log(`shouldDetach isBack: ${isBack} key: ${key} result: ${shouldDetach}`);

        return shouldDetach;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        route = findTopActivatedRouteNodeForOutlet(route);

        const outletKey = this.location.getRouteFullPath(route);
        const outlet = this.location.findOutletByKey(outletKey);
        const cache = this.cacheByOutlet[outletKey];
        if (!cache) {
            return false;
        }

        const key = getSnapshotKey(route);
        const isBack = outlet ? outlet.isPageNavigationBack : false;
        const shouldAttach = isBack && cache.peek().key === key;

        log(`shouldAttach isBack: ${isBack} key: ${key} result: ${shouldAttach}`);

        if (outlet) {
            outlet.shouldDetach = true;
        }

        return shouldAttach;
    }

    store(route: ActivatedRouteSnapshot, state: DetachedRouteHandle): void {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        log(`store key: ${key}, state: ${state}`);

        const outletKey = this.location.getRouteFullPath(route);

        // tslint:disable-next-line:max-line-length
        const cache = this.cacheByOutlet[outletKey] = this.cacheByOutlet[outletKey] || new DetachedStateCache();

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

                if (!cache.length) {
                    delete this.cacheByOutlet[outletKey];
                }
            } else {
                throw new Error("Trying to pop from DetachedStateCache but keys don't match. " +
                    `expected: ${topItem.key} actual: ${key}`);
            }
        }
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        route = findTopActivatedRouteNodeForOutlet(route);

        const outletKey = this.location.getRouteFullPath(route);
        const outlet = this.location.findOutletByKey(outletKey);
        const cache = this.cacheByOutlet[outletKey];
        if (!cache) {
            return null;
        }

        const key = getSnapshotKey(route);
        const isBack = outlet ? outlet.isPageNavigationBack : false;
        const cachedItem = cache.peek();

        let state = null;
        if (isBack && cachedItem && cachedItem.key === key) {
            state = cachedItem.state;
        }

        log(`retrieved isBack: ${isBack} key: ${key} state: ${state}`);

        return state;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const shouldReuse = future.routeConfig === curr.routeConfig;

        if (shouldReuse && curr && curr[pageRouterActivatedSymbol]) {
            // When reusing route - copy the pageRouterActivated to the new snapshot
            // It's needed in shouldDetach to determine if the route should be detached.
            future[pageRouterActivatedSymbol] = curr[pageRouterActivatedSymbol];
        }

        log(`shouldReuseRoute result: ${shouldReuse}`);

        return shouldReuse;
    }

    clearCache(outletKey: string) {
        const cache = this.cacheByOutlet[outletKey];

        if (cache) {
            cache.clear();
        }
    }

    clearModalCache(outletKey: string) {
        const cache = this.cacheByOutlet[outletKey];

        if (cache) {
            cache.clearModalCache();
        }
    }
}

function getSnapshotKey(snapshot: ActivatedRouteSnapshot): string {
  // return snapshot.pathFromRoot.join("->");
  return snapshot.pathFromRoot
    .map(route => route.routeConfig && route.routeConfig.path)
    .filter(path => !!path)
    .join('/');
}
