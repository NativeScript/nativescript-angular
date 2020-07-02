import {
    Attribute, ChangeDetectorRef,
    ComponentFactory, ComponentFactoryResolver, ComponentRef,
    Directive, Inject, InjectionToken, Injector,
    OnDestroy, EventEmitter, Output,
    Type, ViewContainerRef, ElementRef, InjectFlags
} from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    ChildrenOutletContexts,
    PRIMARY_OUTLET,
} from '@angular/router';

import { Device } from '@nativescript/core/platform';
import { Frame } from '@nativescript/core/ui/frame';
import { Page, NavigatedData } from '@nativescript/core/ui/page';
import { profile } from '@nativescript/core/profiling';

import { BehaviorSubject } from 'rxjs';

import { DEVICE, PAGE_FACTORY, PageFactory } from '../platform-providers';
import { PageService } from '../page.service';
import { NativeScriptDebug } from '../trace';
import { DetachedLoader } from '../common/detached-loader';
import { ViewUtil } from '../view-util';
import { NSLocationStrategy } from './ns-location-strategy';
import { Outlet } from './ns-location-utils';
import { NSRouteReuseStrategy } from './ns-route-reuse-strategy';
import { findTopActivatedRouteNodeForOutlet, pageRouterActivatedSymbol, loaderRefSymbol, destroyComponentRef } from './page-router-outlet-utils';

export class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;

    constructor(startRoute: ActivatedRoute) {
        this.activatedRoute = new BehaviorSubject(startRoute);
    }
}

export class DestructibleInjector implements Injector {
    private refs = new Set<any>();
    constructor(private destructableProviders: ProviderSet, private parent: Injector) {
    }
    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
        const ref = this.parent.get(token, notFoundValue, flags);
        if (this.destructableProviders.has(token)) {
            this.refs.add(ref);
        }
        return ref;
    }
    destroy() {
        this.refs.forEach((ref) => {
            if (ref.ngOnDestroy instanceof Function) {
                ref.ngOnDestroy();
            }
        });
        this.refs.clear();
    }
}

type ProviderSet = Set<Type<any> | InjectionToken<any>>;

const routeToString = function(activatedRoute: ActivatedRoute | ActivatedRouteSnapshot): string {
  return activatedRoute.pathFromRoot.join('->');
};

@Directive({ selector: 'page-router-outlet' }) // tslint:disable-line:directive-selector
export class PageRouterOutlet implements OnDestroy { // tslint:disable-line:directive-class-suffix
    private activated: ComponentRef<any> | null = null;
    private _activatedRoute: ActivatedRoute | null = null;
    private detachedLoaderFactory: ComponentFactory<DetachedLoader>;

    private outlet: Outlet;
    private name: string;
    private isEmptyOutlet: boolean;
    private viewUtil: ViewUtil;
    private frame: Frame;

    @Output('activate') activateEvents = new EventEmitter<any>(); // tslint:disable-line:no-output-rename
    @Output('deactivate') deactivateEvents = new EventEmitter<any>(); // tslint:disable-line:no-output-rename

    /** @deprecated from Angular since v4 */
    get locationInjector(): Injector { return this.location.injector; }
    /** @deprecated from Angular since v4 */
    get locationFactoryResolver(): ComponentFactoryResolver { return this.resolver; }

    get isActivated(): boolean {
        return !!this.activated;
    }

    get component(): Object {
        if (!this.activated) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('Outlet is not activated');
            }
            return;
        }

        return this.activated.instance;
    }
    get activatedRoute(): ActivatedRoute {
        if (!this.activated) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('Outlet is not activated');
            }
            return;
        }

        return this._activatedRoute;
    }

    constructor(
        private parentContexts: ChildrenOutletContexts,
        private location: ViewContainerRef,
        @Attribute('name') name: string,
        @Attribute('actionBarVisibility') actionBarVisibility: string,
        @Attribute('isEmptyOutlet') isEmptyOutlet: boolean,
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
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog(`PageRouterOutlet.constructor frame: ${this.frame}`);
        }

        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, <any>this);

        this.viewUtil = new ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(DetachedLoader);
    }

    setActionBarVisibility(actionBarVisibility: string): void {
        switch (actionBarVisibility) {
            case 'always':
            case 'never':
                this.frame.actionBarVisibility = actionBarVisibility;
                return;

            default:
                this.frame.actionBarVisibility = 'auto';
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
            NativeScriptDebug.routerLog('PageRouterOutlet.ngOnDestroy: no outlet available for page-router-outlet');
        }

        if (this.isActivated) {
            const c = this.activated.instance;
            this.activated.hostView.detach();
            destroyComponentRef(this.activated);

            this.deactivateEvents.emit(c);
            this.activated = null;
        }
    }

    deactivate(): void {
        if (!this.outlet || !this.outlet.isPageNavigationBack) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('Currently not in page back navigation - component should be detached instead of deactivated.');
            }
            return;
        }

        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('PageRouterOutlet.deactivate() while going back - should destroy');
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
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('Outlet is not activated');
            }
            return;
        }

        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog(`PageRouterOutlet.detach() - ${routeToString(this._activatedRoute)}`);
        }

        // Detach from ChangeDetection
        this.activated.hostView.detach();

        const component = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return component;
    }

    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog(`PageRouterOutlet.attach() - ${routeToString(activatedRoute)}`);
        }

        this.activated = ref;

        // reattach to ChangeDetection
        this.activated.hostView.markForCheck();
        this.activated.hostView.reattach();
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
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerError('No outlet found relative to activated route');
            }
            return;
        }

        this.outlet.isNSEmptyOutlet = this.isEmptyOutlet;
        this.locationStrategy.updateOutletFrame(this.outlet, this.frame, this.isEmptyOutlet);

        if (this.outlet && this.outlet.isPageNavigationBack) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('Currently in page back navigation - component should be reattached instead of activated.');
            }
            this.locationStrategy._finishBackPageNavigation(this.frame);
        }

        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog(`PageRouterOutlet.activateWith() - ${routeToString(activatedRoute)}`);
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
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('PageRouterOutlet.activate() forward navigation - ' +
                'create detached loader in the loader container');
        }

        const factory = this.getComponentFactory(activatedRoute, loadedResolver);
        const page = this.pageFactory({
            isNavigation: true,
            componentType: factory.componentType,
        });

        const destructables = new Set([PageService]);
        const injector = Injector.create({
            providers: [
                { provide: Page, useValue: page },
                { provide: PageService, useClass: PageService, deps: [Page] },
                { provide: Frame, useValue: this.frame },
                { provide: PageRoute, useValue: new PageRoute(activatedRoute) },
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: ChildrenOutletContexts,
                    useValue: this.parentContexts.getOrCreateContext(this.name).children }
            ],
            parent: this.location.injector
        });

        const childInjector = new DestructibleInjector(destructables, injector);
        const loaderRef = this.location.createComponent(
            this.detachedLoaderFactory, this.location.length, childInjector, []);
        loaderRef.onDestroy(() => childInjector.destroy());
        this.changeDetector.markForCheck();

        this.activated = loaderRef.instance.loadWithFactory(factory);
        this.loadComponentInPage(page, this.activated, { activatedRoute });

        this.activated[loaderRefSymbol] = loaderRef;
    }

    @profile
    private loadComponentInPage(page: Page, componentRef: ComponentRef<any>, navigationContext): void {
        // Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        // Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        // Add it to the new page
        this.viewUtil.insertChild(page, componentView);

        const navigatedFromCallback = (<any>global).Zone.current.wrap((args: NavigatedData) => {
            if (args.isBackNavigation) {
                this.locationStrategy._beginBackPageNavigation(this.frame);
                this.locationStrategy.back(null, this.frame);
            }
        });
        page.on(Page.navigatedFromEvent, navigatedFromCallback);
        componentRef.onDestroy(() => {
            if (page) {
                page.off(Page.navigatedFromEvent, navigatedFromCallback);
                page = null;
            }
        });

        const navOptions = this.locationStrategy._beginPageNavigation(this.frame);

        // Clear refCache if navigation with clearHistory
        if (navOptions.clearHistory) {
            const clearCallback = () => setTimeout(() => {
                if (this.outlet) {
                    this.routeReuseStrategy.clearCache(this.outlet.outletKeys[0]);
                }
            });

            page.once(Page.navigatedToEvent, clearCallback);
        }

        this.frame.navigate({
            create() {
                return page;
            },
            context: navigationContext,
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

            const topActivatedRoute = findTopActivatedRouteNodeForOutlet(currentRoute);
            let outletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute);
            let outlet = this.locationStrategy.findOutlet(outletKey, topActivatedRoute);

            if (outlet && outlet.frames.length) {
                topActivatedRoute[pageRouterActivatedSymbol] = true;
                if (NativeScriptDebug.isLogEnabled()) {
                    NativeScriptDebug.routerLog('Activated route marked as page: ' + routeToString(topActivatedRoute));
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
        const outletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute);
        let outlet = this.locationStrategy.findOutlet(outletKey, topActivatedRoute);

        // Named lazy loaded outlet.
        if (!outlet && this.isEmptyOutlet) {
            const parentOutletKey = this.locationStrategy.getRouteFullPath(topActivatedRoute.parent);
            outlet = this.locationStrategy.findOutlet(parentOutletKey, topActivatedRoute.parent);

            if (outlet) {
                outlet.outletKeys.push(outletKey);
            }
        }

        return outlet;
    }
}
