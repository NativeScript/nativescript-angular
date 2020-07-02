import { ComponentRef } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ChildrenOutletContexts,
  PRIMARY_OUTLET,
} from "@angular/router";

/**
 * There are cases where multiple activatedRoute nodes should be associated/handled by the same PageRouterOutlet.
 * We can gat additional ActivatedRoutes nodes when there is:
 *  - Lazy loading - there is an additional ActivatedRoute node for the RouteConfig with the `loadChildren` setup
 *  - Componentless routes - there is an additional ActivatedRoute node for the componentless RouteConfig
 *
 * Example:
 *   R  <-- root
 *   |
 * feature (lazy module) <-- RouteConfig: { path: "lazy", loadChildren: "./feature/feature.module#FeatureModule" }
 *   |
 * module (componentless route) <-- RouteConfig: { path: "module", children: [...] } // Note: No 'component'
 *   |
 *  home <-- RouteConfig: { path: "module", component: MyComponent } - this is what we get as activatedRoute param
 *
 *  In these cases we will mark the top-most node (feature). NSRouteReuseStrategy will detach the tree there and
 *  use this ActivateRoute as a kay for caching.
 */
export function findTopActivatedRouteNodeForOutlet(
  activatedRoute: ActivatedRouteSnapshot
): ActivatedRouteSnapshot {
  let outletActivatedRoute = activatedRoute;

  while (
    outletActivatedRoute.parent &&
    outletActivatedRoute.parent.routeConfig &&
    !outletActivatedRoute.parent.routeConfig.component
  ) {
    outletActivatedRoute = outletActivatedRoute.parent;
  }

  return outletActivatedRoute;
}

export const pageRouterActivatedSymbol = Symbol("page-router-activated");
export const loaderRefSymbol = Symbol("loader-ref");

export function destroyComponentRef(componentRef: ComponentRef<any>) {
  if (componentRef) {
    const loaderRef = componentRef[loaderRefSymbol];
    if (loaderRef) {
      loaderRef.destroy();
    }
    componentRef.destroy();
  }
}
