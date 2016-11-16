import {
    Attribute, ComponentFactory, ComponentRef, Directive,
    ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef,
    Inject, ComponentFactoryResolver, Injector
} from '@angular/core';
import { isPresent } from "../lang-facade";
import { RouterOutletMap, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { NSLocationStrategy } from "./ns-location-strategy";
import { DEVICE, PAGE_FACTORY, PageFactory } from "../platform-providers";
import { Device } from "platform";
import { routerLog } from "../trace";
import { DetachedLoader } from "../common/detached-loader";
import { ViewUtil } from "../view-util";
import { Frame } from "ui/frame";
import { Page, NavigatedData } from "ui/page";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

interface CacheItem {
    componentRef: ComponentRef<any>;
    reusedRoute: PageRoute;
    outletMap: RouterOutletMap;
    loaderRef?: ComponentRef<any>;
}

export class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;
    constructor(startRoute: ActivatedRoute) {
        this.activatedRoute = new BehaviorSubject(startRoute);
    }
}

/**
 * Reference Cache
 */
class RefCache {
    private cache: Array<CacheItem> = new Array<CacheItem>();

    public push(
        componentRef: ComponentRef<any>,
        reusedRoute: PageRoute,
        outletMap: RouterOutletMap,
        loaderRef: ComponentRef<any>) {
        this.cache.push({ componentRef, reusedRoute, outletMap, loaderRef });
    }

    public pop(): CacheItem {
        return this.cache.pop();
    }

    public peek(): CacheItem {
        return this.cache[this.cache.length - 1];
    }

    public get length(): number {
        return this.cache.length;
    }
}

@Directive({ selector: 'page-router-outlet' })
export class PageRouterOutlet {
    private viewUtil: ViewUtil;
    private refCache: RefCache = new RefCache();
    private isInitalPage: boolean = true;
    private detachedLoaderFactory: ComponentFactory<DetachedLoader>;

    private currentActivatedComp: ComponentRef<any>;
    private currentActivatedRoute: ActivatedRoute;

    public outletMap: RouterOutletMap;

    get isActivated(): boolean {
        return !!this.currentActivatedComp;
    }

    get component(): Object {
        if (!this.currentActivatedComp) {
            throw new Error('Outlet is not activated');
        }

        return this.currentActivatedComp.instance;
    }
    get activatedRoute(): ActivatedRoute {
        if (!this.currentActivatedComp) {
            throw new Error('Outlet is not activated');
        }

        return this.currentActivatedRoute;
    }

    constructor(
        parentOutletMap: RouterOutletMap,
        private containerRef: ViewContainerRef,
        @Attribute('name') name: string,
        private locationStrategy: NSLocationStrategy,
        private componentFactoryResolver: ComponentFactoryResolver,
        resolver: ComponentFactoryResolver,
        private frame: Frame,
        @Inject(DEVICE) device: Device,
        @Inject(PAGE_FACTORY) private pageFactory: PageFactory) {

        parentOutletMap.registerOutlet(name ? name : PRIMARY_OUTLET, <any>this);

        this.viewUtil = new ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(DetachedLoader);
        log("DetachedLoaderFactory loaded");
    }

    deactivate(): void {
        if (this.locationStrategy._isPageNavigatingBack()) {
            log("PageRouterOutlet.deactivate() while going back - should destroy");
            const popedItem = this.refCache.pop();
            const popedRef = popedItem.componentRef;

            if (this.currentActivatedComp !== popedRef) {
                throw new Error("Current componentRef is different for cached componentRef");
            }

            this.destroyCacheItem(popedItem);
            this.currentActivatedComp = null;

        } else {
            log("PageRouterOutlet.deactivate() while going foward - do nothing");
        }
    }

    private clearRefCache() {
        while (this.refCache.length > 0) {
            this.destroyCacheItem(this.refCache.pop());
        }
    }
    private destroyCacheItem(popedItem: CacheItem) {
        if (isPresent(popedItem.componentRef)) {
            popedItem.componentRef.destroy();
        }

        if (isPresent(popedItem.loaderRef)) {
            popedItem.loaderRef.destroy();
        }
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activate(
        activatedRoute: ActivatedRoute, loadedResolver: ComponentFactoryResolver,
        loadedInjector: Injector, providers: ResolvedReflectiveProvider[],
        outletMap: RouterOutletMap): void {
        this.outletMap = outletMap;
        this.currentActivatedRoute = activatedRoute;

        if (this.locationStrategy._isPageNavigatingBack()) {
            this.activateOnGoBack(activatedRoute, providers, outletMap);
        } else {
            this.activateOnGoForward(activatedRoute, providers, outletMap, loadedResolver);
        }
    }

    private activateOnGoForward(
        activatedRoute: ActivatedRoute,
        providers: ResolvedReflectiveProvider[],
        outletMap: RouterOutletMap,
        loadedResolver: ComponentFactoryResolver): void {
        const factory = this.getComponentFactory(activatedRoute, loadedResolver);

        const pageRoute = new PageRoute(activatedRoute);
        providers = [...providers, ...ReflectiveInjector.resolve([{ provide: PageRoute, useValue: pageRoute }])];

        if (this.isInitalPage) {
            log("PageRouterOutlet.activate() inital page - just load component");
            this.isInitalPage = false;
            const inj = ReflectiveInjector.fromResolvedProviders(providers, this.containerRef.parentInjector);
            this.currentActivatedComp = this.containerRef.createComponent(factory, this.containerRef.length, inj, []);
            this.refCache.push(this.currentActivatedComp, pageRoute, outletMap, null);

        } else {
            log("PageRouterOutlet.activate() forward navigation - create detached loader in the loader container");

            const page = this.pageFactory({ isNavigation: true, componentType: factory.componentType });
            const pageResolvedProvider = ReflectiveInjector.resolve([
                { provide: Page, useValue: page }
            ]);
            const childInjector = ReflectiveInjector.fromResolvedProviders([...providers, ...pageResolvedProvider], this.containerRef.parentInjector);
            const loaderRef = this.containerRef.createComponent(this.detachedLoaderFactory, this.containerRef.length, childInjector, []);

            this.currentActivatedComp = loaderRef.instance.loadWithFactory(factory);
            this.loadComponentInPage(page, this.currentActivatedComp);
            this.refCache.push(this.currentActivatedComp, pageRoute, outletMap, loaderRef);
        }
    }

    private activateOnGoBack(
        activatedRoute: ActivatedRoute,
        providers: ResolvedReflectiveProvider[],
        outletMap: RouterOutletMap): void {
        log("PageRouterOutlet.activate() - Back naviation, so load from cache");

        this.locationStrategy._finishBackPageNavigation();

        let cacheItem = this.refCache.peek();
        cacheItem.reusedRoute.activatedRoute.next(activatedRoute);

        this.outletMap = cacheItem.outletMap;

        // HACK: Fill the outlet map provided by the router, with the outlets that we have cached.
        // This is needed beacuse the component is taken form the cache and not created - so it will not register
        // its child router-outlets to the newly created outlet map.
        (<any>Object).assign(outletMap, cacheItem.outletMap);

        this.currentActivatedComp = cacheItem.componentRef;
    }

    private loadComponentInPage(page: Page, componentRef: ComponentRef<any>): void {
        //Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        //Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        //Add it to the new page
        page.content = componentView;

        page.on('navigatedFrom', (<any>global).Zone.current.wrap((args: NavigatedData) => {
            // console.log("page.navigatedFrom: " + page + " args.isBackNavigation:" + args.isBackNavigation);

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
            this.clearRefCache();
        }
    }

    // NOTE: Using private APIs - potential break point!
    private getComponentFactory(activatedRoute: any, loadedResolver: ComponentFactoryResolver): ComponentFactory<any> {
        const snapshot = activatedRoute._futureSnapshot;
        const component = <any>snapshot._routeConfig.component;
        let factory: ComponentFactory<any>;

        if (loadedResolver) {
            factory = loadedResolver.resolveComponentFactory(component);
        } else {
            factory = this.componentFactoryResolver.resolveComponentFactory(component);
        }

        return factory;
    }
}

function log(msg: string) {
    routerLog(msg);
}
