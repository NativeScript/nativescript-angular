import {
    Attribute, ChangeDetectorRef,
    ComponentFactory, ComponentFactoryResolver, ComponentRef,
    Directive, Inject, InjectionToken, Injector,
    OnDestroy, OnInit,
    Type, ViewContainerRef,
} from "@angular/core";
import {
    ActivatedRoute,
    ChildrenOutletContexts,
    PRIMARY_OUTLET,
} from "@angular/router";

import { Device } from "tns-core-modules/platform";
import { Frame } from "tns-core-modules/ui/frame";
import { Page, NavigatedData } from "tns-core-modules/ui/page";
import { profile } from "tns-core-modules/profiling";

import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { isPresent } from "../lang-facade";
import { DEVICE, PAGE_FACTORY, PageFactory } from "../platform-providers";
import { routerLog } from "../trace";
import { DetachedLoader } from "../common/detached-loader";
import { ViewUtil } from "../view-util";
import { NSLocationStrategy } from "./ns-location-strategy";

export class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;

    constructor(startRoute: ActivatedRoute) {
        this.activatedRoute = new BehaviorSubject(startRoute);
    }
}

class ChildInjector implements Injector {
    constructor(
        private providers: ProviderMap,
        private parent: Injector
    ) {}

    get<T>(token: Type<T>|InjectionToken<T>, notFoundValue?: T): T {
        return this.providers.get(token) || this.parent.get(token, notFoundValue);
    }
}

/**
 * Reference Cache
 */
class RefCache {
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

    public clear(): void {
        while (this.length) {
            RefCache.destroyItem(this.pop());
        }
    }

    public static destroyItem(item: CacheItem) {
        if (isPresent(item.componentRef)) {
            item.componentRef.destroy();
        }

        if (isPresent(item.loaderRef)) {
            item.loaderRef.destroy();
        }
    }
}

interface CacheItem {
    componentRef: ComponentRef<any>;
    reusedRoute: PageRoute;
    loaderRef?: ComponentRef<any>;
}


type ProviderMap = Map<Type<any>|InjectionToken<any>, any>;

const log = (msg: string) => routerLog(msg);

@Directive({ selector: "page-router-outlet" }) // tslint:disable-line:directive-selector
export class PageRouterOutlet implements OnDestroy, OnInit { // tslint:disable-line:directive-class-suffix
    private activated: ComponentRef<any>|null = null;
    private _activatedRoute: ActivatedRoute|null = null;
    private refCache: RefCache = new RefCache();
    private isInitialPage: boolean = true;
    private detachedLoaderFactory: ComponentFactory<DetachedLoader>;
    private itemsToDestroy: CacheItem[] = [];

    private name: string;
    private viewUtil: ViewUtil;

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
        private frame: Frame,
        private changeDetector: ChangeDetectorRef,
        @Inject(DEVICE) device: Device,
        @Inject(PAGE_FACTORY) private pageFactory: PageFactory
    ) {

        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, <any>this);

        this.viewUtil = new ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(DetachedLoader);
        log("DetachedLoaderFactory loaded");
    }

    ngOnDestroy(): void {
        this.parentContexts.onChildOutletDestroyed(this.name);
    }

    ngOnInit(): void {
        if (this.isActivated) {
            return;
        }

        // If the outlet was not instantiated at the time the route got activated we need to populate
        // the outlet when it is initialized (ie inside a NgIf)
        const context = this.parentContexts.getContext(this.name);
        if (!context || !context.route) {
            return;
        }

        if (context.attachRef) {
            // `attachRef` is populated when there is an existing component to mount
            this.attach(context.attachRef, context.route);
        } else {
            // otherwise the component defined in the configuration is created
            this.activateWith(context.route, context.resolver || null);
        }
    }

    deactivate(): void {
        if (this.locationStrategy._isPageNavigatingBack()) {
            log("PageRouterOutlet.deactivate() while going back - should destroy");
            if (!this.isActivated) {
                return;
            }

            const poppedItem = this.refCache.pop();
            const poppedRef = poppedItem.componentRef;

            if (this.activated !== poppedRef) {
                throw new Error("Current componentRef is different for cached componentRef");
            }

            RefCache.destroyItem(poppedItem);
            this.activated = null;
        } else {
            log("PageRouterOutlet.deactivate() while going forward - do nothing");
        }
    }

    private destroyQueuedCacheItems() {
        while (this.itemsToDestroy.length > 0) {
            this.destroyCacheItem(this.itemsToDestroy.pop());
        }
    }

    private destroyCacheItem(poppedItem: CacheItem) {
        if (isPresent(poppedItem.componentRef)) {
            poppedItem.componentRef.destroy();
        }

        if (isPresent(poppedItem.loaderRef)) {
            poppedItem.loaderRef.destroy();
        }
    }

    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach(): ComponentRef<any> {
        if (!this.isActivated) {
            throw new Error("Outlet is not activated");
        }

        this.location.detach();
        const cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return cmp;
    }

    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        log("PageRouterOutlet.attach()" +
            "when RouteReuseStrategy instructs to re-attach " +
            "previously detached subtree");

        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    @profile
    activateWith(
        activatedRoute: ActivatedRoute,
        resolver: ComponentFactoryResolver|null
    ): void {

        log("PageRouterOutlet.activateWith() - " +
            "instanciating new component during commit phase of a navigation");

        this._activatedRoute = activatedRoute;
        resolver = resolver || this.resolver;

        if (this.locationStrategy._isPageNavigatingBack()) {
            this.activateOnGoBack(activatedRoute);
        } else {
            this.activateOnGoForward(activatedRoute, resolver);
        }
    }

    private activateOnGoForward(
        activatedRoute: ActivatedRoute,
        loadedResolver: ComponentFactoryResolver
    ): void {

        const pageRoute = new PageRoute(activatedRoute);
        const providers = this.initProvidersMap(activatedRoute, pageRoute);
        const childInjector = new ChildInjector(providers, this.location.injector);
        const factory = this.getComponentFactory(activatedRoute, loadedResolver);

        if (this.isInitialPage) {
            log("PageRouterOutlet.activate() initial page - just load component");

            this.isInitialPage = false;

            this.activated = this.location.createComponent(
                factory, this.location.length, childInjector, []);
            this.changeDetector.markForCheck();

            this.refCache.push({
                componentRef: this.activated,
                reusedRoute: pageRoute,
                loaderRef: null,
            });
        } else {
            log("PageRouterOutlet.activate() forward navigation - " +
                "create detached loader in the loader container");

            const page = this.pageFactory({
                isNavigation: true,
                componentType: factory.componentType,
            });

            providers.set(Page, page);

            const loaderRef = this.location.createComponent(
                this.detachedLoaderFactory, this.location.length, childInjector, []);
            this.changeDetector.markForCheck();

            this.activated = loaderRef.instance.loadWithFactory(factory);
            this.loadComponentInPage(page, this.activated);

            this.refCache.push({
                componentRef: this.activated,
                reusedRoute: pageRoute,
                loaderRef,
            });
        }
    }

    private initProvidersMap(
        activatedRoute: ActivatedRoute,
        pageRoute: PageRoute
    ): ProviderMap {

        const providers = new Map();
        providers.set(PageRoute, pageRoute);
        providers.set(ActivatedRoute, activatedRoute);

        const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        providers.set(ChildrenOutletContexts, childContexts);

        return providers;
    }

    private activateOnGoBack(activatedRoute: ActivatedRoute): void {
        log("PageRouterOutlet.activate() - Back navigation, so load from cache");

        this.locationStrategy._finishBackPageNavigation();

        const cacheItem = this.refCache.peek();
        cacheItem.reusedRoute.activatedRoute.next(activatedRoute);

        this.activated = cacheItem.componentRef;
    }

    @profile
    private loadComponentInPage(page: Page, componentRef: ComponentRef<any>): void {
        // Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        // Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        // Add it to the new page
        page.content = componentView;

        page.on(Page.navigatedToEvent, () => setTimeout(() => {
            this.destroyQueuedCacheItems();
        }));
        page.on(Page.navigatedFromEvent, (<any>global).Zone.current.wrap((args: NavigatedData) => {
            if (args.isBackNavigation) {
                this.locationStrategy._beginBackPageNavigation();
                this.locationStrategy.back();
            }
        }));

        const navOptions = this.locationStrategy._beginPageNavigation();
        this.frame.navigate({
            create: () => { return page; },
            clearHistory: navOptions.clearHistory,
            animated: navOptions.animated,
            transition: navOptions.transition
        });

        // Clear refCache if navigation with clearHistory
        if (navOptions.clearHistory) {
            this.refCache.clear();
        }
    }

    // NOTE: Using private APIs - potential break point!
    private getComponentFactory(
        activatedRoute: any,
        loadedResolver: ComponentFactoryResolver
    ): ComponentFactory<any> {
        const snapshot = activatedRoute._futureSnapshot;
        const component = <any>snapshot._routeConfig.component;

        return loadedResolver ?
            loadedResolver.resolveComponentFactory(component) :
            this.componentFactoryResolver.resolveComponentFactory(component);
    }
}
