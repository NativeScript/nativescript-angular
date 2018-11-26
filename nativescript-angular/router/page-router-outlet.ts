import {
    Attribute, ChangeDetectorRef,
    ComponentFactory, ComponentFactoryResolver, ComponentRef,
    Directive, Inject, InjectionToken, Injector,
    OnDestroy, EventEmitter, Output,
    Type, ViewContainerRef, ElementRef
} from "@angular/core";
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    ChildrenOutletContexts,
    PRIMARY_OUTLET,
} from "@angular/router";

import { Device } from "tns-core-modules/platform";
import { Frame } from "tns-core-modules/ui/frame";
import { Page, NavigatedData } from "tns-core-modules/ui/page";
import { profile } from "tns-core-modules/profiling";

import { BehaviorSubject } from "rxjs";

import { DEVICE, PAGE_FACTORY, PageFactory } from "../platform-providers";
import { routerLog as log, routerError as error, isLogEnabled } from "../trace";
import { DetachedLoader } from "../common/detached-loader";
import { ViewUtil } from "../view-util";
import { NSLocationStrategy, Outlet } from "./ns-location-strategy";
import { NSRouteReuseStrategy } from "./ns-route-reuse-strategy";

export class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;

    constructor(startRoute: ActivatedRoute) {
        this.activatedRoute = new BehaviorSubject(startRoute);
    }
}

// Used to "mark" ActivatedRoute snapshots that are handled in PageRouterOutlet
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

class ChildInjector implements Injector {
    constructor(
        private providers: ProviderMap,
        private parent: Injector
    ) { }

    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
        let localValue = this.providers.get(token);
        if (localValue) {
            return localValue;
        }

        return this.parent.get(token, notFoundValue);
    }
}

type ProviderMap = Map<Type<any> | InjectionToken<any>, any>;

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
export function findTopActivatedRouteNodeForOutlet(activatedRoute: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let outletActivatedRoute = activatedRoute;

    while (outletActivatedRoute.parent &&
        outletActivatedRoute.parent.routeConfig &&
        !outletActivatedRoute.parent.routeConfig.component) {

        outletActivatedRoute = outletActivatedRoute.parent;
    }

    return outletActivatedRoute;
}

function routeToString(activatedRoute: ActivatedRoute | ActivatedRouteSnapshot): string {
    return activatedRoute.pathFromRoot.join("->");
}

@Directive({ selector: "page-router-outlet" }) // tslint:disable-line:directive-selector
export class PageRouterOutlet implements OnDestroy { // tslint:disable-line:directive-class-suffix
    private activated: ComponentRef<any> | null = null;
    private _activatedRoute: ActivatedRoute | null = null;
    private detachedLoaderFactory: ComponentFactory<DetachedLoader>;

    private outlet: Outlet;
    private name: string;
    private isEmptyOutlet: boolean;
    private viewUtil: ViewUtil;
    private frame: Frame;

    @Output("activate") activateEvents = new EventEmitter<any>(); // tslint:disable-line:no-output-rename
    @Output("deactivate") deactivateEvents = new EventEmitter<any>(); // tslint:disable-line:no-output-rename

    /** @deprecated from Angular since v4 */
    get locationInjector(): Injector { return this.location.injector; }
    /** @deprecated from Angular since v4 */
    get locationFactoryResolver(): ComponentFactoryResolver { return this.resolver; }

    get isActivated(): boolean {
        return !!this.activated;
    }

    get component(): Object {
        if (!this.activated) {
            if (isLogEnabled()) {
                log("Outlet is not activated");
            }
            return;
        }

        return this.activated.instance;
    }
    get activatedRoute(): ActivatedRoute {
        if (!this.activated) {
            if (isLogEnabled()) {
                log("Outlet is not activated");
            }
            return;
        }

        return this._activatedRoute;
    }

    constructor(
        private parentContexts: ChildrenOutletContexts,
        private location: ViewContainerRef,
        @Attribute("name") name: string,
        @Attribute("actionBarVisibility") actionBarVisibility: string,
        @Attribute("isEmptyOutlet") isEmptyOutlet: boolean,
        private locationStrategy: NSLocationStrategy,
        private componentFactoryResolver: ComponentFactoryResolver,
        private resolver: ComponentFactoryResolver,
        private changeDetector: ChangeDetectorRef,
        @Inject(DEVICE) device: Device,
        @Inject(PAGE_FACTORY) private pageFactory: PageFactory,
        private routeReuseStrategy: NSRouteReuseStrategy,
        elRef: ElementRef
    ) {
        this.isEmptyOutlet = isEmptyOutlet;
        this.frame = elRef.nativeElement;
        this.setActionBarVisibility(actionBarVisibility);
        if (isLogEnabled()) {
            log(`PageRouterOutlet.constructor frame: ${this.frame}`);
        }

        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, <any>this);

        this.viewUtil = new ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(DetachedLoader);
    }

    setActionBarVisibility(actionBarVisibility: string): void {
        switch (actionBarVisibility) {
            case "always":
            case "never":
                this.frame.actionBarVisibility = actionBarVisibility;
                return;

            default:
                this.frame.actionBarVisibility = "auto";
        }
    }

    ngOnDestroy(): void {
        // Clear accumulated modal view page cache when page-router-outlet
        // destroyed on modal view closing
        this.parentContexts.onChildOutletDestroyed(this.name);

        if (this.outlet) {
            this.outlet.outletKeys.forEach(key => {
                this.routeReuseStrategy.clearModalCache(key);
            });
            this.locationStrategy.clearOutlet(this.frame);
        } else {
            log("NSLocationStrategy.ngOnDestroy: no outlet available for page-router-outlet");
        }
    }

    deactivate(): void {
        if (!this.outlet || !this.outlet.isPageNavigationBack) {
            if (isLogEnabled()) {
                log("Currently not in page back navigation - component should be detached instead of deactivated.");
            }
            return;
        }

        if (isLogEnabled()) {
            log("PageRouterOutlet.deactivate() while going back - should destroy");
        }

        if (!this.isActivated) {
            return;
        }

        const c = this.activated.instance;
        destroyComponentRef(this.activated);

        this.activated = null;
        this._activatedRoute = null;

        this.deactivateEvents.emit(c);
    }

    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach(): ComponentRef<any> {
        if (!this.isActivated) {
            if (isLogEnabled()) {
                log("Outlet is not activated");
            }
            return;
        }

        if (isLogEnabled()) {
            log(`PageRouterOutlet.detach() - ${routeToString(this._activatedRoute)}`);
        }

        const component = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return component;
    }

    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        if (isLogEnabled()) {
            log(`PageRouterOutlet.attach() - ${routeToString(activatedRoute)}`);
        }

        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.markActivatedRoute(activatedRoute);

        this.locationStrategy._finishBackPageNavigation(this.frame);
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    @profile
    activateWith(
        activatedRoute: ActivatedRoute,
        resolver: ComponentFactoryResolver | null): void {

        this.outlet = this.outlet || this.getOutlet(activatedRoute.snapshot);
        if (!this.outlet) {
            if (isLogEnabled()) {
                error("No outlet found relative to activated route");
            }
            return;
        }

        this.outlet.isNSEmptyOutlet = this.isEmptyOutlet;
        this.locationStrategy.updateOutletFrame(this.outlet, this.frame);

        if (this.outlet && this.outlet.isPageNavigationBack) {
            if (isLogEnabled()) {
                log("Currently in page back navigation - component should be reattached instead of activated.");
            }
            this.locationStrategy._finishBackPageNavigation(this.frame);
        }

        if (isLogEnabled()) {
            log(`PageRouterOutlet.activateWith() - ${routeToString(activatedRoute)}`);
        }

        this._activatedRoute = activatedRoute;

        this.markActivatedRoute(activatedRoute);

        resolver = resolver || this.resolver;

        this.activateOnGoForward(activatedRoute, resolver);
        this.activateEvents.emit(this.activated.instance);
    }

    private activateOnGoForward(
        activatedRoute: ActivatedRoute,
        loadedResolver: ComponentFactoryResolver
    ): void {
        if (isLogEnabled()) {
            log("PageRouterOutlet.activate() forward navigation - " +
                "create detached loader in the loader container");
        }

        const factory = this.getComponentFactory(activatedRoute, loadedResolver);
        const page = this.pageFactory({
            isNavigation: true,
            componentType: factory.componentType,
        });

        const providers = new Map();
        providers.set(Page, page);
        providers.set(Frame, this.frame);
        providers.set(PageRoute, new PageRoute(activatedRoute));
        providers.set(ActivatedRoute, activatedRoute);
        providers.set(ChildrenOutletContexts, this.parentContexts.getOrCreateContext(this.name).children);

        const childInjector = new ChildInjector(providers, this.location.injector);
        const loaderRef = this.location.createComponent(
            this.detachedLoaderFactory, this.location.length, childInjector, []);
        this.changeDetector.markForCheck();

        this.activated = loaderRef.instance.loadWithFactory(factory);
        this.loadComponentInPage(page, this.activated);

        this.activated[loaderRefSymbol] = loaderRef;
    }

    @profile
    private loadComponentInPage(page: Page, componentRef: ComponentRef<any>): void {
        // Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        // Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        // Add it to the new page
        page.content = componentView;

        page.on(Page.navigatedFromEvent, (<any>global).Zone.current.wrap((args: NavigatedData) => {
            if (args.isBackNavigation) {
                this.locationStrategy._beginBackPageNavigation(this.frame);
                this.locationStrategy.back();
            }
        }));

        const navOptions = this.locationStrategy._beginPageNavigation(this.frame);

        // Clear refCache if navigation with clearHistory
        if (navOptions.clearHistory) {
            const clearCallback = () => setTimeout(() => {
                if (this.outlet) {
                    this.routeReuseStrategy.clearCache(this.outlet.outletKeys[0]);
                }
                page.off(Page.navigatedToEvent, clearCallback);
            });

            page.on(Page.navigatedToEvent, clearCallback);
        }

        this.frame.navigate({
            create: () => { return page; },
            clearHistory: navOptions.clearHistory,
            animated: navOptions.animated,
            transition: navOptions.transition
        });
    }

    // Find and mark the top activated route as an activated one.
    // In ns-location-strategy we are reusing components only if their corresponing routes
    // are marked as activated from this method.
    private markActivatedRoute(activatedRoute: ActivatedRoute) {
        const queue = [];
        queue.push(activatedRoute.snapshot);
        let currentRoute = queue.shift();

        while (currentRoute) {
            currentRoute.children.forEach(childRoute => {
                queue.push(childRoute);
            });

            const nodeToMark = findTopActivatedRouteNodeForOutlet(currentRoute);
            let outletKeyForRoute = this.locationStrategy.getRouteFullPath(nodeToMark);
            let outlet = this.locationStrategy.findOutletByKey(outletKeyForRoute);

            if (outlet && outlet.frames.length) {
                nodeToMark[pageRouterActivatedSymbol] = true;
                if (isLogEnabled()) {
                    log("Activated route marked as page: " + routeToString(nodeToMark));
                }
            }

            currentRoute = queue.shift();
        }
    }

    private getComponentFactory(
        activatedRoute: ActivatedRoute,
        loadedResolver: ComponentFactoryResolver
    ): ComponentFactory<any> {
        const { component } = activatedRoute.routeConfig;

        return loadedResolver ?
            loadedResolver.resolveComponentFactory(component) :
            this.componentFactoryResolver.resolveComponentFactory(component);
    }

    private getOutlet(activatedRouteSnapshot: ActivatedRouteSnapshot): Outlet {
        const topActivatedRoute = findTopActivatedRouteNodeForOutlet(activatedRouteSnapshot);
        const modalNavigation = this.locationStrategy._modalNavigationDepth;
        const outletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute);
        let outlet;

        if (modalNavigation > 0) { // Modal with 'primary' p-r-o
            outlet = this.locationStrategy.findOutletByModal(modalNavigation);
        } else {
            outlet = this.locationStrategy.findOutletByKey(outletKey);
        }

        // Named lazy loaded outlet.
        if (!outlet && this.isEmptyOutlet) {
            const parentOutletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute.parent);
            outlet = this.locationStrategy.findOutletByKey(parentOutletKey);

            if (outlet) {
                outlet.outletKeys.push(outletKey);
            }
        }

        return outlet;
    }
}
