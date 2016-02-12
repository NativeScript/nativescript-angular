import {PromiseWrapper} from 'angular2/src/facade/async';
import {isBlank, isPresent} from 'angular2/src/facade/lang';

import {Directive, Attribute, DynamicComponentLoader, ComponentRef, ElementRef,
    Injector, provide, Type, Component, OpaqueToken, Inject} from 'angular2/core';

import * as routerHooks from 'angular2/src/router/lifecycle_annotations';
import { hasLifecycleHook} from 'angular2/src/router/route_lifecycle_reflector';

import { ComponentInstruction, RouteParams, RouteData, RouterOutlet, LocationStrategy, Router,
    OnActivate, OnDeactivate } from 'angular2/router';
    
import { topmost } from "ui";
import { Page, NavigatedData } from "ui/page";
import { log } from "./common";

let COMPONENT = new OpaqueToken("COMPONENT");
let _resolveToTrue = PromiseWrapper.resolve(true);
let _resolveToFalse = PromiseWrapper.resolve(false);

/**
 * Reference Cache
 */
class RefCache {
    private cache: Array<ComponentRef> = new Array<ComponentRef>();

    public push(comp: ComponentRef) {
        this.cache.push(comp);
    }

    public pop(): ComponentRef {
        return this.cache.pop();
    }

    public peek(): ComponentRef {
        return this.cache[this.cache.length - 1];
    }
}

var _isGoingBack = false;
function startGoBack() {
    log("startGoBack()");
    if (_isGoingBack) {
        throw new Error("Calling startGoBack while going back.")
    }
    _isGoingBack = true;
}

function endGoBack() {
    log("endGoBack()");
    if (!_isGoingBack) {
        throw new Error("Calling endGoBack while not going back.")
    }
    _isGoingBack = false;
}

function isGoingBack() {
    return _isGoingBack;
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
@Directive({ selector: 'page-router-outlet' })
export class PageRouterOutlet extends RouterOutlet {
    private isInitalPage: boolean = true;
    private refCache: RefCache = new RefCache();

    private componentRef: ComponentRef = null;
    private currentComponentType: ComponentRef = null;
    private currentInstruction: ComponentInstruction = null;

    constructor(private elementRef: ElementRef,
        private loader: DynamicComponentLoader,
        private parentRouter: Router,
        @Attribute('name') nameAttr: string) {
        super(elementRef, loader, parentRouter, nameAttr)
    }

    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activate(nextInstruction: ComponentInstruction): Promise<any> {
        this.log("activate", nextInstruction);

        let previousInstruction = this.currentInstruction;
        let componentType = nextInstruction.componentType;
        this.currentInstruction = nextInstruction;

        if (isGoingBack()) {
            log("PageRouterOutlet.activate() - Back naviation, so load from cache: " + componentType.name);

            endGoBack();
            
            // Get Component form ref and just call the activate hook
            this.componentRef = this.refCache.peek();
            this.currentComponentType = componentType;
            this.checkComponentRef(this.componentRef, nextInstruction);

            if (hasLifecycleHook(routerHooks.routerOnActivate, componentType)) {
                return (<OnActivate>this.componentRef.instance)
                    .routerOnActivate(nextInstruction, previousInstruction);
            }
        }
        else {
            let childRouter = this.parentRouter.childRouter(componentType);
            let providers = Injector.resolve([
                provide(RouteData, { useValue: nextInstruction.routeData }),
                provide(RouteParams, { useValue: new RouteParams(nextInstruction.params) }),
                provide(Router, { useValue: childRouter }),
                provide(COMPONENT, { useValue: componentType }),
            ]);
            
            // TODO: Is there a better way to check first load?
            if (this.isInitalPage) {
                log("PageRouterOutlet.activate() inital page - just load component: " + componentType.name);
                this.isInitalPage = false;
            }
            else {
                log("PageRouterOutlet.activate() forward navigation - wrap component in page: " + componentType.name);
                componentType = PageShim;
            }

            return this.loader.loadNextToLocation(componentType, this.elementRef, providers)
                .then((componentRef) => {
                    this.componentRef = componentRef;
                    this.currentComponentType = componentType;
                    this.refCache.push(componentRef);

                    if (hasLifecycleHook(routerHooks.routerOnActivate, componentType)) {
                        return (<OnActivate>this.componentRef.instance)
                            .routerOnActivate(nextInstruction, previousInstruction);
                    }
                });
        }
    }

    /**
     * Called by the {@link Router} when an outlet disposes of a component's contents.
     * This method in turn is responsible for calling the `routerOnDeactivate` hook of its child.
     */
    deactivate(nextInstruction: ComponentInstruction): Promise<any> {
        this.log("deactivate", nextInstruction);
        var instruction = this.currentInstruction;
        var compType = this.currentComponentType;

        var next = _resolveToTrue;
        if (isPresent(this.componentRef) &&
            isPresent(instruction) &&
            isPresent(compType) &&
            hasLifecycleHook(routerHooks.routerOnDeactivate, compType)) {
            next = PromiseWrapper.resolve(
                (<OnDeactivate>this.componentRef.instance).routerOnDeactivate(nextInstruction, this.currentInstruction));
        }

        if (isGoingBack()) {
            log("PageRouterOutlet.deactivate() while going back - should dispose: " + instruction.componentType.name)
            return next.then((_) => {
                let popedRef = this.refCache.pop();

                if (this.componentRef !== popedRef) {
                    throw new Error("Current componentRef is different for cached componentRef");
                }
                this.checkComponentRef(popedRef, instruction);

                if (isPresent(this.componentRef)) {
                    this.componentRef.dispose();
                    this.componentRef = null;
                }
            });
        }
        else {
            return next;
        }
    }

    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     * PageRouterOutlet will aways return true as cancelling navigation
     * is currently not supported in NativeScript.
     */
    routerCanDeactivate(nextInstruction: ComponentInstruction): Promise<boolean> {
        return _resolveToTrue;
    }

    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     * For PageRouterOutlet it always reurns false, as there is no way to reuse 
     * the same componenet between two pages.
     */
    routerCanReuse(nextInstruction: ComponentInstruction): Promise<boolean> {
        return _resolveToFalse;
    }

    /**
     * Called by the {@link Router} during the commit phase of a navigation when an outlet
     * reuses a component between different routes.
     * For PageRouterOutlet this method should never be called,
     * because routerCanReuse always returns false.
     */
    reuse(nextInstruction: ComponentInstruction): Promise<any> {
        throw new Error("reuse() method should never be called for PageRouterOutlet.")
        return _resolveToFalse;
    }

    private checkComponentRef(popedRef: ComponentRef, instruction: ComponentInstruction) {
        if (popedRef.instance instanceof PageShim) {
            var shim = <PageShim>popedRef.instance;
            if (shim.componentType !== instruction.componentType) {
                throw new Error("ComponentRef value is different form expected!");
            }
        }
    }

    private log(method: string, nextInstruction: ComponentInstruction) {
        log("PageRouterOutlet." + method + " isBack: " + isGoingBack() + " nextUrl: " + nextInstruction.urlPath);
    }
}

@Component({
    selector: 'nativescript-page-shim',
    template: `
        <StackLayout visibility="collapse" style="background-color: hotpink">
            <Placeholder #content></Placeholder>
        <StackLayout>
        `
})
class PageShim implements OnActivate, OnDeactivate {
    private static pageShimCount: number = 0;
    private id: number;
    private isInitialized: boolean;
    private componentRef: ComponentRef;

    constructor(
        private element: ElementRef,
        private loader: DynamicComponentLoader,
        private locationStrategy: LocationStrategy,
        @Inject(COMPONENT) public componentType: Type
    ) {
        this.id = PageShim.pageShimCount++;
        this.log("constructor");
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("routerOnActivate");
        let result = PromiseWrapper.resolve(true);
        
        // On first activation:
        // 1. Load componenet using loadIntoLocation.
        // 2. Hijack its native element.
        // 3. Put that element into a new page and navigate to it.
        if (!this.isInitialized) {
            result = new Promise((resolve, reject) => {
                this.isInitialized = true;
                this.loader.loadIntoLocation(this.componentType, this.element, 'content')
                    .then((componentRef) => {
                        this.componentRef = componentRef;
                    
                        //Component loaded. Find its root native view.
                        const viewContainer = this.componentRef.location.nativeElement;
                        //Remove from original native parent.
                        //TODO: assuming it's a Layout.
                        (<any>viewContainer.parent).removeChild(viewContainer);

                        topmost().navigate({
                            animated: true,
                            create: () => {
                                const page = new Page();
                                page.on('loaded', () => {
                                    // Finish activation when page is fully loaded.
                                    resolve()
                                });

                                page.on('navigatingFrom', (<any>global).zone.bind((args: NavigatedData) => {
                                    if (args.isBackNavigation) {
                                        startGoBack();
                                        this.locationStrategy.back();
                                    }
                                }));
                            
                                // Add to new page.
                                page.content = viewContainer;
                                return page;
                            }
                        });
                    });
            });
        }

        if (hasLifecycleHook(routerHooks.routerOnActivate, this.componentType)) {
            result = result.then(() => {
                return (<OnActivate>this.componentRef.instance).routerOnActivate(nextInstruction, prevInstruction);
            });
        }
        return result;
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("routerOnDeactivate");
        if (hasLifecycleHook(routerHooks.routerOnDeactivate, this.componentType)) {
            return (<OnDeactivate>this.componentRef.instance).routerOnDeactivate(nextInstruction, prevInstruction);
        }
    }

    private log(methodName: string) {
        log("PageShim(" + this.id + ")." + methodName)
    }
}
