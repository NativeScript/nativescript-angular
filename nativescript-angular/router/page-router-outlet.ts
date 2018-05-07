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
import { routerLog as log } from "../trace";
import { DetachedLoader } from "../common/detached-loader";
import { ViewUtil } from "../view-util";
import { NSLocationStrategy } from "./ns-location-strategy";
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

    private name: string;
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
            throw new Error("Outlet is not activated");
        }

        return this.activated.instance;
    }
    get activatedRoute(): ActivatedRoute {
        if (!this.activated) {
            throw new Error("Outlet is not activated");
        }

        return this._activatedRoute;
    }

    constructor(
        private parentContexts: ChildrenOutletContexts,
        private location: ViewContainerRef,
        @Attribute("name") name: string,
        private locationStrategy: NSLocationStrategy,
        private componentFactoryResolver: ComponentFactoryResolver,
        private resolver: ComponentFactoryResolver,
        private changeDetector: ChangeDetectorRef,
        @Inject(DEVICE) device: Device,
        @Inject(PAGE_FACTORY) private pageFactory: PageFactory,
        private routeReuseStrategy: NSRouteReuseStrategy,
        elRef: ElementRef
    ) {
        this.frame = elRef.nativeElement;
        log("PageRouterOutlet.constructor frame:" + this.frame);

        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, <any>this);

        this.viewUtil = new ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(DetachedLoader);
    }

    ngOnDestroy(): void {
        // Clear accumulated modal view page cache when page-router-outlet
        // destroyed on modal view closing
        this.routeReuseStrategy.clearModalCache(this.name);
        this.parentContexts.onChildOutletDestroyed(this.name);
    }

    deactivate(): void {
        if (!this.locationStrategy._isPageNavigatingBack()) {
            throw new Error("Currently not in page back navigation" +
                " - component should be detached instead of deactivated.");
        }

        log("PageRouterOutlet.deactivate() while going back - should destroy");

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
            throw new Error("Outlet is not activated");
        }

        log("PageRouterOutlet.detach() - " + routeToString(this._activatedRoute));

        const component = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return component;
    }

    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        log("PageRouterOutlet.attach() - " + routeToString(activatedRoute));

        this.activated = ref;
        this._activatedRoute = activatedRoute;

        this.markActivatedRoute(activatedRoute);

        this.locationStrategy._finishBackPageNavigation();
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    @profile
    activateWith(
        activatedRoute: ActivatedRoute,
        resolver: ComponentFactoryResolver | null): void {

        if (this.locationStrategy._isPageNavigatingBack()) {
            throw new Error("Currently in page back navigation - component should be reattached instead of activated.");
        }

        log("PageRouterOutlet.activateWith() - " + routeToString(activatedRoute));

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
        log("PageRouterOutlet.activate() forward navigation - " +
            "create detached loader in the loader container");

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
                this.locationStrategy._beginBackPageNavigation(this.name);
                this.locationStrategy.back();
            }
        }));

        const navOptions = this.locationStrategy._beginPageNavigation(this.name);

        // Clear refCache if navigation with clearHistory
        if (navOptions.clearHistory) {
            const clearCallback = () => setTimeout(() => {
                this.routeReuseStrategy.clearCache(this.name);
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

    private markActivatedRoute(activatedRoute: ActivatedRoute) {
        const nodeToMark = findTopActivatedRouteNodeForOutlet(activatedRoute.snapshot);
        nodeToMark[pageRouterActivatedSymbol] = true;
        log("Activated route marked as page: " + routeToString(nodeToMark));
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
}
