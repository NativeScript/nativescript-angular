import {PromiseWrapper} from 'angular2/src/facade/async';
import {isBlank, isPresent} from 'angular2/src/facade/lang';
import {StringMapWrapper} from 'angular2/src/facade/collection';

import {Attribute, DynamicComponentLoader, ComponentRef,
    ElementRef, Injector, provide, Type, Component} from 'angular2/core';

import * as routerHooks from 'angular2/src/router/lifecycle/lifecycle_annotations';
import {hasLifecycleHook} from 'angular2/src/router/lifecycle/route_lifecycle_reflector';

import {
    ComponentInstruction, RouteParams, RouteData,
    RouterOutlet, LocationStrategy, Router,
    OnActivate, OnDeactivate, CanReuse, OnReuse
} from 'angular2/router';

import {topmost} from "ui/frame";
import {Page, NavigatedData} from "ui/page";
import {log} from "./common";
import {NSLocationStrategy} from "./ns-location-strategy";
import {DetachedLoader} from "../common/detached-loader";

let _resolveToTrue = PromiseWrapper.resolve(true);

interface CacheItem {
    componentRef: ComponentRef;
    loaderRef?: ComponentRef;
    router: Router;
}

/**
 * Reference Cache
 */
class RefCache {
    private cache: Array<CacheItem> = new Array<CacheItem>();

    public push(comp: ComponentRef, router: Router, loaderRef?: ComponentRef) {
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

    private componentRef: ComponentRef = null;
    private currentInstruction: ComponentInstruction = null;

    constructor(private elementRef: ElementRef,
        private loader: DynamicComponentLoader,
        private parentRouter: Router,
        @Attribute('name') nameAttr: string,
        private location: NSLocationStrategy) {
        super(elementRef, loader, parentRouter, nameAttr)
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
        log("PageRouterOutlet.activate() - Back naviation, so load from cache: " + nextInstruction.componentType.name);

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
        let loaderRef: ComponentRef = undefined;
        const childRouter = this.parentRouter.childRouter(componentType);

        const providersArray = [
            provide(RouteData, { useValue: nextInstruction.routeData }),
            provide(RouteParams, { useValue: new RouteParams(nextInstruction.params) }),
            provide(Router, { useValue: childRouter }),
        ];

        if (this.isInitalPage) {
            log("PageRouterOutlet.activate() inital page - just load component: " + componentType.name);
            this.isInitalPage = false;
            resultPromise = this.loader.loadNextToLocation(componentType, this.elementRef, Injector.resolve(providersArray));
        } else {
            log("PageRouterOutlet.activate() forward navigation - create detached loader in the loader container: " + componentType.name);

            const page = new Page();
            providersArray.push(provide(Page, { useValue: page }));
            resultPromise = this.loader.loadIntoLocation(DetachedLoader, this.elementRef, "loader", Injector.resolve(providersArray))
                .then((pageComponentRef) => {
                    loaderRef = pageComponentRef;
                    return (<DetachedLoader>loaderRef.instance).loadComponent(componentType);
                })
                .then((actualCoponenetRef) => {
                    return this.loadComponentInPage(page, actualCoponenetRef);
                })
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


    private loadComponentInPage(page: Page, componentRef: ComponentRef): Promise<ComponentRef> {
        //Component loaded. Find its root native view.
        const componentView = componentRef.location.nativeElement;
        //Remove it from original native parent.
        if (<any>componentView.parent) {
            (<any>componentView.parent).removeChild(componentView);
        }
        //Add it to the new page
        page.content = componentView;

        this.location.navigateToNewPage();
        return new Promise((resolve, reject) => {
            page.on('navigatedTo', () => {
                // Finish activation when page is fully navigated to.
                resolve(componentRef)
            });

            page.on('navigatingFrom', (<any>global).Zone.current.wrap((args: NavigatedData) => {
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
            log("PageRouterOutlet.deactivate() while going back - should dispose: " + instruction.componentType.name)
            return next.then((_) => {
                const popedItem = this.refCache.pop();
                const popedRef = popedItem.componentRef;

                if (this.componentRef !== popedRef) {
                    throw new Error("Current componentRef is different for cached componentRef");
                }

                if (isPresent(this.componentRef)) {
                    this.componentRef.dispose();
                    this.componentRef = null;
                }

                if (isPresent(popedItem.loaderRef)) {
                    popedItem.loaderRef.dispose();
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

        log("PageRouterOutlet.routerCanReuse(): " + result);
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
        log("PageRouterOutlet." + method + " isBack: " + this.location.isPageNavigatingBack() + " nextUrl: " + nextInstruction.urlPath);
    }
}