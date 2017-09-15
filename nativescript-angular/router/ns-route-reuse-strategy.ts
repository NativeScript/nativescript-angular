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
}

/**
 * Detaches subtrees loaded inside PageRouterOutlet in forward navigation
 * and reattaches them on back.
 * Reuses routes as long as their route config is the same.
 */
@Injectable()
export class NSRouteReuseStrategy implements RouteReuseStrategy {
    private cache: DetachedStateCache = new DetachedStateCache();

    constructor(private location: NSLocationStrategy) { }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        const isPageActivated = route[pageRouterActivatedSymbol];
        const isBack = this.location._isPageNavigatingBack();
        const shouldDetach = !isBack && isPageActivated;

        log(`shouldDetach isBack: ${isBack} key: ${key} result: ${shouldDetach}`);

        return shouldDetach;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        const isBack = this.location._isPageNavigatingBack();
        const shouldAttach = isBack && this.cache.peek().key === key;

        log(`shouldAttach isBack: ${isBack} key: ${key} result: ${shouldAttach}`);

        return shouldAttach;
    }

    store(route: ActivatedRouteSnapshot, state: DetachedRouteHandle): void {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        log(`store key: ${key}, state: ${state}`);

        if (state) {
            this.cache.push({ key, state });
        } else {
            const topItem = this.cache.peek();
            if (topItem.key === key) {
                this.cache.pop();
            } else {
                throw new Error("Trying to pop from DetachedStateCache but keys don't match. " +
                    `expected: ${topItem.key} actual: ${key}`);
            }
        }
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        route = findTopActivatedRouteNodeForOutlet(route);

        const key = getSnapshotKey(route);
        const isBack = this.location._isPageNavigatingBack();
        const cachedItem = this.cache.peek();

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

    clearCache() {
        this.cache.clear();
    }
}

function getSnapshotKey(snapshot: ActivatedRouteSnapshot): string {
    return snapshot.pathFromRoot.join("->");
}
