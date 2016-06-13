import {PromiseWrapper} from '@angular/core/src/facade/async';
import {isBlank, isPresent} from '@angular/core/src/facade/lang';
import {StringMapWrapper} from '@angular/core/src/facade/collection';

import {
    Attribute, ComponentRef,
    ViewContainerRef, ViewChild, ElementRef,
    ReflectiveInjector, provide, Type,
    Component, Inject, DynamicComponentLoader, ComponentResolver
} from '@angular/core';

import * as routerHooks from '@angular/router-deprecated/src/lifecycle/lifecycle_annotations';
import {hasLifecycleHook} from '@angular/router-deprecated/src/lifecycle/route_lifecycle_reflector';

import {Router, RouterOutlet, RouteData, RouteParams, ComponentInstruction,
    OnActivate, OnDeactivate, OnReuse, CanReuse} from '@angular/router-deprecated';
import {LocationStrategy} from '@angular/common';
import {topmost} from "ui/frame";
import {Page, NavigatedData} from "ui/page";
import {DEVICE} from "../platform-providers";
import {Device} from "platform";
import {routerLog} from "../trace";
import {NSLocationStrategy} from "./ns-location-strategy";
import {DetachedLoader} from "../common/detached-loader";
import {ViewUtil} from "../view-util";

let _resolveToTrue = PromiseWrapper.resolve(true);

interface CacheItem {
    componentRef: ComponentRef<any>;
    loaderRef?: ComponentRef<any>;
    router: Router;
}

/**
 * Reference Cache
 */
class RefCache {
    private cache: Array<CacheItem> = new Array<CacheItem>();

    public push(comp: ComponentRef<any>, router: Router, loaderRef?: ComponentRef<any>) {
        this.cache.push({ componentRef: comp, router: router, loaderRef: loaderRef });
    }

    public pop(): CacheItem {
        return this.cache.pop();
    }

    public peek(): CacheItem {
        return this.cache[this.cache.length - 1];
    }
}

/**
 * A router outlet that does page navigation in NativeScript
 *
 * ## Use
 *
 * ```
 * <page-router-outlet></page-router-outlet>
 * ```
 */
@Component({
    selector: 'page-router-outlet',
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>`
})
export class PageRouterOutlet extends RouterOutlet {
    private isInitalPage: boolean = true;
    private refCache: RefCache = new RefCache();

    private componentRef: ComponentRef<any> = null;
    private currentInstruction: ComponentInstruction = null;
    private viewUtil: ViewUtil;
    @ViewChild('loader', { read: ViewContainerRef }) childContainerRef: ViewContainerRef;

    constructor(
        private containerRef: ViewContainerRef,
        private compiler: ComponentResolver,
        private parentRouter: Router,
        @Attribute('name') nameAttr: string,
        private location: NSLocationStrategy,
        loader: DynamicComponentLoader,
        @Inject(DEVICE) device: Device
    ) {
        super(containerRef, loader, parentRouter, nameAttr);
        this.viewUtil = new ViewUtil(device);
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activate(nextInstruction: ComponentInstruction): Promise<any> {
        this.log("activate", nextInstruction);
        let previousInstruction = this.currentInstruction;
        this.currentInstruction = nextInstruction;

        if (this.location.isPageNavigatingBack()) {
            return this.activateOnGoBack(nextInstruction, previousInstruction);
        } else {
            return this.activateOnGoForward(nextInstruction, previousInstruction);
        }
    }

    private activateOnGoBack(nextInstruction: ComponentInstruction, previousInstruction: ComponentInstruction): Promise<any> {
        routerLog("PageRouterOutlet.activate() - Back naviation, so load from cache: " + nextInstruction.componentType.name);

        this.location.finishBackPageNavigation();

        // Get Component form ref and just call the activate hook
        let cacheItem = this.refCache.peek();
        this.componentRef = cacheItem.componentRef;
        this.replaceChildRouter(cacheItem.router);

        if (hasLifecycleHook(routerHooks.routerOnActivate, this.componentRef.componentType)) {
            return (<OnActivate>this.componentRef.instance)
                .routerOnActivate(nextInstruction, previousInstruction);
        }
    }

    private activateOnGoForward(nextInstruction: ComponentInstruction, previousInstruction: ComponentInstruction): Promise<any> {
        let componentType = nextInstruction.componentType;
        let resultPromise: Promise<any>;
        let loaderRef: ComponentRef<any> = undefined;
        const childRouter = this.parentRouter.childRouter(componentType);

        const providersArray = [
            provide(RouteData, { useValue: nextInstruction.routeData }),
            provide(RouteParams, { useValue: new RouteParams(nextInstruction.params) }),
            provide(Router, { useValue: childRouter }),
        ];

        if (this.isInitalPage) {
            routerLog("PageRouterOutlet.activate() inital page - just load component: " + componentType.name);
            this.isInitalPage = false;
            resultPromise = this.compiler.resolveComponent(componentType).then((componentFactory) => {
                const childInjector = ReflectiveInjector.resolveAndCreate(providersArray, this.containerRef.parentInjector);
                return this.containerRef.createComponent(componentFactory, this.containerRef.length, childInjector, null);
            });
        } else {
            routerLog("PageRouterOutlet.activate() forward navigation - create detached loader in the loader container: " + componentType.name);

            const page = new Page();
            providersArray.push(provide(Page, { useValue: page }));
            const childInjector = ReflectiveInjector.resolveAndCreate(providersArray, this.containerRef.parentInjector);

            resultPromise = this.compiler.resolveComponent(DetachedLoader).then((componentFactory) => {
                loaderRef = this.childContainerRef.createComponent(componentFactory, this.childContainerRef.length, childInjector, null);

                return (<DetachedLoader>loaderRef.instance).loadComponent(componentType)
                    .then((actualCoponenetRef) => {
                        return this.loadComponentInPage(page, actualCoponenetRef);
                    });
            });
        }

        return resultPromise.then((componentRef) => {
            this.componentRef = componentRef;
            this.refCache.push(componentRef, childRouter, loaderRef);

            if (hasLifecycleHook(routerHooks.routerOnActivate, componentType)) {
                return (<OnActivate>this.componentRef.instance)
                    .routerOnActivate(nextInstruction, previousInstruction);
            }
        });
    }


    private loadComponentInPage(page: Page, componentRef: ComponentRef<any>): Promise<ComponentRef<any>> {
        //Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        //Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        //Add it to the new page
        page.content = componentView;

        this.location.navigateToNewPage();
        return new Promise((resolve, reject) => {
            page.on('navigatingTo', () => {
                // Finish activation when page navigation has started
                resolve(componentRef)
            });

            page.on('navigatedFrom', (<any>global).Zone.current.wrap((args: NavigatedData) => {
                if (args.isBackNavigation) {
                    this.location.beginBackPageNavigation();
                    this.location.back();
                }
            }));

            topmost().navigate({
                animated: true,
                create: () => { return page; }
            });
        });
    }

    /**
     * Called by the {@link Router} when an outlet disposes of a component's contents.
     * This method in turn is responsible for calling the `routerOnDeactivate` hook of its child.
     */
    deactivate(nextInstruction: ComponentInstruction): Promise<any> {
        this.log("deactivate", nextInstruction);
        var instruction = this.currentInstruction;

        var next = _resolveToTrue;
        if (isPresent(this.componentRef) &&
            isPresent(instruction) &&
            hasLifecycleHook(routerHooks.routerOnDeactivate, this.componentRef.componentType)) {
            next = PromiseWrapper.resolve(
                (<OnDeactivate>this.componentRef.instance).routerOnDeactivate(nextInstruction, this.currentInstruction));
        }

        if (this.location.isPageNavigatingBack()) {
            routerLog("PageRouterOutlet.deactivate() while going back - should destroy: " + instruction.componentType.name)
            return next.then((_) => {
                const popedItem = this.refCache.pop();
                const popedRef = popedItem.componentRef;

                if (this.componentRef !== popedRef) {
                    throw new Error("Current componentRef is different for cached componentRef");
                }

                if (isPresent(this.componentRef)) {
                    this.componentRef.destroy();
                    this.componentRef = null;
                }

                if (isPresent(popedItem.loaderRef)) {
                    popedItem.loaderRef.destroy();
                }
            });
        } else {
            return next;
        }
    }

    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     * PageRouterOutlet will aways return true as cancelling navigation
     * is currently not supported in NativeScript.
     */
    routerCanDeactivate(nextInstruction: ComponentInstruction): Promise<boolean> {
        this.log("routerCanDeactivate", nextInstruction);

        return _resolveToTrue;
    }

    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If the new child component has a different Type than the existing child component,
     * this will resolve to `false`. You can't reuse an old component when the new component
     * is of a different Type.
     *
     * Otherwise, this method delegates to the child component's `routerCanReuse` hook if it exists,
     * or resolves to true if the hook is not present and params are equal.
     */
    routerCanReuse(nextInstruction: ComponentInstruction): Promise<boolean> {
        this.log("routerCanReuse", nextInstruction);

        var result;

        if (isBlank(this.currentInstruction) || this.currentInstruction.componentType != nextInstruction.componentType) {
            result = false;
        } else if (hasLifecycleHook(routerHooks.routerCanReuse, this.currentInstruction.componentType)) {
            result = (<CanReuse>this.componentRef.instance)
                .routerCanReuse(nextInstruction, this.currentInstruction);
        } else {
            result = nextInstruction == this.currentInstruction ||
                (isPresent(nextInstruction.params) && isPresent(this.currentInstruction.params) &&
                    StringMapWrapper.equals(nextInstruction.params, this.currentInstruction.params));
        }

        routerLog("PageRouterOutlet.routerCanReuse(): " + result);
        return PromiseWrapper.resolve(result);
    }

    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If this resolves to `false`, the given navigation is cancelled.
     *
     * This method delegates to the child component's `routerCanDeactivate` hook if it exists,
     * and otherwise resolves to true.
     */
    reuse(nextInstruction: ComponentInstruction): Promise<any> {
        var previousInstruction = this.currentInstruction;
        this.currentInstruction = nextInstruction;

        if (isBlank(this.componentRef)) {
            throw new Error(`Cannot reuse an outlet that does not contain a component.`);
        }

        return PromiseWrapper.resolve(
            hasLifecycleHook(routerHooks.routerOnReuse, this.componentRef.componentType) ?
                (<OnReuse>this.componentRef.instance).routerOnReuse(nextInstruction, previousInstruction) : true);
    }

    private replaceChildRouter(childRouter: Router) {
        // HACKY HACKY HACKY
        // When navigationg back - we need to set the child router of
        // our router - with the one we have created for the previosus page.
        // Otherwise router-outlets inside that page wont't work.
        // Curretly there is no other way to do that (parentRouter.childRouter() will create ne router).

        this.parentRouter["_childRouter"] = childRouter;
    }

    private log(method: string, nextInstruction: ComponentInstruction) {
        routerLog("PageRouterOutlet." + method + " isBack: " + this.location.isPageNavigatingBack() + " nextUrl: " + nextInstruction.urlPath);
    }
}
