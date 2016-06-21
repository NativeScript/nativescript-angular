import {
    Attribute, ComponentFactory, ComponentRef, Directive,
    ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef,
    Inject, ComponentResolver, provide} from '@angular/core';

import {isBlank, isPresent} from '@angular/core/src/facade/lang';

import {RouterOutletMap, ActivatedRoute, PRIMARY_OUTLET} from '@angular/router';
import {RouterOutlet} from '@angular/router/directives/router_outlet';
import {NSLocationStrategy} from "./ns-location-strategy";
import {DEVICE} from "../platform-providers";
import {Device} from "platform";
import {routerLog} from "../trace";
import {DetachedLoader} from "../common/detached-loader";
import {ViewUtil} from "../view-util";
import {topmost} from "ui/frame";
import {Page, NavigatedData} from "ui/page";

interface CacheItem {
    componentRef: ComponentRef<any>;
    loaderRef?: ComponentRef<any>;
}

/**
 * Reference Cache
 */
class RefCache {
    private cache: Array<CacheItem> = new Array<CacheItem>();

    public push(comp: ComponentRef<any>, loaderRef?: ComponentRef<any>) {
        this.cache.push({ componentRef: comp, loaderRef: loaderRef });
    }

    public pop(): CacheItem {
        return this.cache.pop();
    }

    public peek(): CacheItem {
        return this.cache[this.cache.length - 1];
    }
}



@Directive({ selector: 'page-router-outlet' })
export class PageRouterOutlet extends RouterOutlet {
    private viewUtil: ViewUtil;
    private refCache: RefCache = new RefCache();
    private isInitalPage: boolean = true;
    private detachedLoaderFactory: ComponentFactory<DetachedLoader>;

    private currnetActivatedComp: ComponentRef<any>;
    private currentActivatedRoute: ActivatedRoute;

    get isActivated(): boolean {
        return !!this.currnetActivatedComp;
    }

    get component(): Object {
        if (!this.currnetActivatedComp) {
            throw new Error('Outlet is not activated');
        }

        return this.currnetActivatedComp.instance;
    }
    get activatedRoute(): ActivatedRoute {
        if (!this.currnetActivatedComp) {
            throw new Error('Outlet is not activated');
        }

        return this.currentActivatedRoute;
    }

    constructor(
        parentOutletMap: RouterOutletMap,
        private containerRef: ViewContainerRef,
        @Attribute('name') name: string,
        private locationStrategy: NSLocationStrategy,
        compiler: ComponentResolver,
        @Inject(DEVICE) device: Device) {
        super(parentOutletMap, containerRef, name)

        this.viewUtil = new ViewUtil(device);
        compiler.resolveComponent(DetachedLoader).then((detachedLoaderFactory) => {
            log("DetachedLoaderFactory leaded");
            this.detachedLoaderFactory = detachedLoaderFactory;
        })
    }

    deactivate(): void {
        if (this.locationStrategy.isPageNavigatingBack()) {
            log("PageRouterOutlet.deactivate() while going back - should destroy");
            const popedItem = this.refCache.pop();
            const popedRef = popedItem.componentRef;

            if (this.currnetActivatedComp !== popedRef) {
                throw new Error("Current componentRef is different for cached componentRef");
            }

            if (isPresent(this.currnetActivatedComp)) {
                this.currnetActivatedComp.destroy();
                this.currnetActivatedComp = null;
            }

            if (isPresent(popedItem.loaderRef)) {
                popedItem.loaderRef.destroy();
            }
        } else {
            log("PageRouterOutlet.deactivate() while going foward - do nothing");
        }
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activate(
        factory: ComponentFactory<any>,
        activatedRoute: ActivatedRoute,
        providers: ResolvedReflectiveProvider[],
        outletMap: RouterOutletMap): void {

        this.outletMap = outletMap;
        this.currentActivatedRoute = activatedRoute;

        if (this.locationStrategy.isPageNavigatingBack()) {
            this.activateOnGoBack(factory, activatedRoute, providers);
        } else {
            this.activateOnGoForward(factory, activatedRoute, providers);
        }
    }

    private activateOnGoForward(
        factory: ComponentFactory<any>,
        activatedRoute: ActivatedRoute,
        providers: ResolvedReflectiveProvider[]): void {

        if (this.isInitalPage) {
            log("PageRouterOutlet.activate() inital page - just load component: " + activatedRoute.component);
            this.isInitalPage = false;
            const inj = ReflectiveInjector.fromResolvedProviders(providers, this.containerRef.parentInjector);
            this.currnetActivatedComp = this.containerRef.createComponent(factory, this.containerRef.length, inj, []);
            this.refCache.push(this.currnetActivatedComp, null);

        } else {
            log("PageRouterOutlet.activate() forward navigation - create detached loader in the loader container: " + activatedRoute.component);

            const page = new Page();
            const pageResolvedProvider = ReflectiveInjector.resolve([provide(Page, { useValue: page })])
            const childInjector = ReflectiveInjector.fromResolvedProviders([...providers, ...pageResolvedProvider], this.containerRef.parentInjector);
            const loaderRef = this.containerRef.createComponent(this.detachedLoaderFactory, this.containerRef.length, childInjector, []);

            this.currnetActivatedComp = loaderRef.instance.loadWithFactory(factory);
            this.loadComponentInPage(page, this.currnetActivatedComp);
            this.refCache.push(this.currnetActivatedComp, loaderRef);
        }
    }

    private activateOnGoBack(factory: ComponentFactory<any>,
        activatedRoute: ActivatedRoute,
        providers: ResolvedReflectiveProvider[]): void {
        log("PageRouterOutlet.activate() - Back naviation, so load from cache: " + activatedRoute.component);

        this.locationStrategy.finishBackPageNavigation();

        let cacheItem = this.refCache.peek();
        this.currnetActivatedComp = cacheItem.componentRef;
    }

    private loadComponentInPage(page: Page, componentRef: ComponentRef<any>): void {
        //Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        //Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        //Add it to the new page
        page.content = componentView;

        this.locationStrategy.navigateToNewPage();

        page.on('navigatedFrom', (<any>global).Zone.current.wrap((args: NavigatedData) => {
            if (args.isBackNavigation) {
                this.locationStrategy.beginBackPageNavigation();
                this.locationStrategy.back();
            }
        }));

        topmost().navigate({
            animated: true,
            create: () => { return page; }
        });
    }
}

function log(msg: string) {
    routerLog(msg);
}



