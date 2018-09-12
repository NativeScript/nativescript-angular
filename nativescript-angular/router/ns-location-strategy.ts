import { Injectable } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree, ActivatedRoute } from "@angular/router";
import { routerLog, routerError } from "../trace";
import { NavigationTransition, Frame } from "tns-core-modules/ui/frame";
import { isPresent } from "../lang-facade";
import { FrameService } from "../platform-providers";

export class Outlet {
    isPageNavigationBack: boolean;
    pathToOutlet: string;
    statesByOutlet: Array<LocationState> = [];
    frames: Array<Frame> = [];

    constructor(pathToOutlet: string) {
        this.pathToOutlet = pathToOutlet;
    }

    peekState() {
        if (this.statesByOutlet.length > 0) {
            return this.statesByOutlet[this.statesByOutlet.length - 1];
        }
        return null;
    }
}

export interface NavigationOptions {
    clearHistory?: boolean;
    animated?: boolean;
    transition?: NavigationTransition;
}

const defaultNavOptions: NavigationOptions = {
    clearHistory: false,
    animated: true
};

export interface LocationState {
    segmentGroup: UrlSegmentGroup;
    isRootSegmentGroup?: boolean;
    isPageNavigation?: boolean;
    isModalNavigation?: boolean;
}

@Injectable()
export class NSLocationStrategy extends LocationStrategy {
    private outlets: Array<Outlet> = [];
    private currentOutlet: Outlet;

    private popStateCallbacks = new Array<(_: any) => any>();
    private _currentNavigationOptions: NavigationOptions;
    private currentUrlTree: UrlTree;

    public _isModalClosing = false;
    public _isModalNavigation = false;

    constructor(private frameService: FrameService) {
        super();
        routerLog("NSLocationStrategy.constructor()");
    }

    path(): string {
        if (!this.currentUrlTree) {
            return "/";
        }

        const state = this.currentOutlet && this.currentOutlet.peekState();
        if (!state) {
            return "/";
        }

        let tree = this.currentUrlTree;

        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (state.isRootSegmentGroup) {
            tree.root = state.segmentGroup;
        } else {
            // tslint:disable-next-line:max-line-length
            let changedOutlet = this.getSegmentGroup(this.currentOutlet.pathToOutlet);
            this.updateSegmentGroup(tree.root, changedOutlet, state.segmentGroup);
        }

        const urlSerializer = new DefaultUrlSerializer();
        const url = urlSerializer.serialize(tree);
        routerLog("NSLocationStrategy.path(): " + url);
        return url;
    }

    prepareExternalUrl(internal: string): string {
        routerLog("NSLocationStrategy.prepareExternalUrl() internal: " + internal);
        return internal;
    }

    pushState(state: any, title: string, url: string, queryParams: string): void {
        routerLog("NSLocationStrategy.pushState state: " +
            `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
        this.pushStateInternal(state, title, url, queryParams);
    }

    pushStateInternal(state: any, title: string, url: string, queryParams: string): void {
        const urlSerializer = new DefaultUrlSerializer();
        this.currentUrlTree = urlSerializer.parse(url);
        const urlTreeRoot = this.currentUrlTree.root;

        if (!Object.keys(urlTreeRoot.children).length) {
            // Handle case where the user declares a component at path "/".
            // The url serializer doesn't parse this url as having a primary outlet.
            const rootOutlet = this.createOutlet("primary", null);
            this.currentOutlet = rootOutlet;
        } else {
            const queue = [];
            queue.push(urlTreeRoot);
            let currentTree = queue.shift();

            while (currentTree) {
                Object.keys(currentTree.children).forEach(outletName => {
                    currentTree.children[outletName].root = urlTreeRoot;
                    currentTree.children[outletName].outlet = outletName;

                    this.upsertOutlet(currentTree.children[outletName]);

                    queue.push(currentTree.children[outletName]);
                });

                currentTree = queue.shift();
            }
        }
    }

    replaceState(state: any, title: string, url: string, queryParams: string): void {
        const states = this.currentOutlet && this.currentOutlet.statesByOutlet;

        if (states && states.length > 0) {
            routerLog("NSLocationStrategy.replaceState changing existing state: " +
                `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
        } else {
            routerLog("NSLocationStrategy.replaceState pushing new state: " +
                `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            this.pushStateInternal(state, title, url, queryParams);
        }
    }

    forward(): void {
        throw new Error("NSLocationStrategy.forward() - not implemented");
    }

    back(outlet?: Outlet): void {
        this.currentOutlet = outlet || this.currentOutlet;

        if (this._isModalClosing) {
            const states = this.currentOutlet.statesByOutlet;
            // We are closing modal view
            // clear the stack until we get to the page that opened the modal view
            let state;
            let modalStatesCleared = false;
            let count = 1;

            while (!modalStatesCleared) {
                state = this.currentOutlet.peekState();

                if (!state) {
                    modalStatesCleared = true;
                    this.callPopState(null, true);
                    continue;
                }

                if (!state.isModalNavigation) {
                    states.pop();
                    count++;
                } else {
                    modalStatesCleared = true;
                    state.isModalNavigation = false;
                }
            }

            routerLog("NSLocationStrategy.back() while closing modal. States popped: " + count);

            if (state) {
                this.callPopState(state, true);
            }
        } else if (this.currentOutlet.isPageNavigationBack) {
            const states = this.currentOutlet.statesByOutlet;
            // We are navigating to the previous page
            // clear the stack until we get to a page navigation state
            let state = states.pop();
            let count = 1;

            while (!state.isPageNavigation) {
                state = states.pop();
                count++;
            }

            routerLog("NSLocationStrategy.back() while navigating back. States popped: " + count);
            this.callPopState(state, true);
        } else {
            let state = this.currentOutlet.peekState();
            if (state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                routerLog("NSLocationStrategy.back() while not navigating back but top" +
                    " state is page - will call frame.goBack()");

                if (!outlet) {
                    const topmostFrame = this.frameService.getFrame();
                    this.currentOutlet = this.getOutletByFrame(topmostFrame);
                }
                this.currentOutlet.frames[this.currentOutlet.frames.length - 1].goBack();
            } else {
                // Nested navigation - just pop the state
                routerLog("NSLocationStrategy.back() while not navigating back but top" +
                    " state is not page - just pop");

                this.callPopState(this.currentOutlet.statesByOutlet.pop(), true);
            }
        }

    }

    canGoBack() {
        return this.currentOutlet.statesByOutlet.length > 1;
    }

    onPopState(fn: (_: any) => any): void {
        routerLog("NSLocationStrategy.onPopState");
        this.popStateCallbacks.push(fn);
    }

    getBaseHref(): string {
        routerLog("NSLocationStrategy.getBaseHref()");
        return "";
    }

    private callPopState(state: LocationState, pop: boolean = true) {
        const urlSerializer = new DefaultUrlSerializer();
        // tslint:disable-next-line:max-line-length
        let changedOutlet = this.getSegmentGroup(this.currentOutlet.pathToOutlet);

        if (state && changedOutlet) {
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, state.segmentGroup);
        } else {
            // when closing modal view there are scenarios (e.g. root viewContainerRef) when we need
            // to clean up the named page router outlet to make sure we will open the modal properly again if needed.
            const topmostFrame = this.frameService.getFrame();
            this.currentOutlet = this.getOutletByFrame(topmostFrame);
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, null);
        }

        const url = urlSerializer.serialize(this.currentUrlTree);
        const change = { url: url, pop: pop };
        for (let fn of this.popStateCallbacks) {
            fn(change);
        }
    }

    public toString() {
        let result = [];

        this.outlets.forEach(outlet => {
            const outletStates = outlet.statesByOutlet;
            const outletLog = outletStates
                // tslint:disable-next-line:max-line-length
                .map((v, i) => `${outlet.pathToOutlet}.${i}.[${v.isPageNavigation ? "PAGE" : "INTERNAL"}].[${v.isModalNavigation ? "MODAL" : "BASE"}] "${v.segmentGroup.toString()}"`)
                .reverse();

            result = result.concat(outletLog);
        });

        return result.join("\n");
    }

    // Methods for syncing with page navigation in PageRouterOutlet
    public _beginBackPageNavigation(frame: Frame) {
        const outlet: Outlet = this.getOutletByFrame(frame);

        if (outlet.isPageNavigationBack) {
            routerError("Attempted to call startGoBack while going back.");
            return;
        }
        routerLog("NSLocationStrategy.startGoBack()");
        outlet.isPageNavigationBack = true;

        this.currentOutlet = outlet;
    }

    public _finishBackPageNavigation(frame: Frame) {
        const outlet: Outlet = this.getOutletByFrame(frame);

        if (!outlet.isPageNavigationBack) {
            routerError("Attempted to call endGoBack while not going back.");
            return;
        }
        routerLog("NSLocationStrategy.finishBackPageNavigation()");
        outlet.isPageNavigationBack = false;
    }

    public _beginModalNavigation(frame: Frame): void {
        routerLog("NSLocationStrategy._beginModalNavigation()");

        this.currentOutlet = this.getOutletByFrame(frame);
        const lastState = this.currentOutlet.peekState();

        if (lastState) {
            lastState.isModalNavigation = true;
        }

        this._isModalNavigation = true;
    }

    public _beginCloseModalNavigation(): void {
        if (this._isModalClosing) {
            routerError("Attempted to call startCloseModal while closing modal.");
            return;
        }
        routerLog("NSLocationStrategy.startCloseModal()");
        this._isModalClosing = true;
    }

    public _finishCloseModalNavigation() {
        if (!this._isModalClosing) {
            routerError("Attempted to call startCloseModal while not closing modal.");
            return;
        }

        routerLog("NSLocationStrategy.finishCloseModalNavigation()");
        this._isModalNavigation = false;
        this._isModalClosing = false;
    }

    public _beginPageNavigation(frame: Frame): NavigationOptions {
        routerLog("NSLocationStrategy._beginPageNavigation()");

        this.currentOutlet = this.getOutletByFrame(frame);
        const lastState = this.currentOutlet.peekState();

        if (lastState) {
            lastState.isPageNavigation = true;
        }

        const navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            routerLog("NSLocationStrategy._beginPageNavigation clearing states history");
            this.currentOutlet.statesByOutlet = [lastState];
        }

        this._currentNavigationOptions = undefined;
        return navOptions;
    }

    public _setNavigationOptions(options: NavigationOptions) {
        this._currentNavigationOptions = {
            clearHistory: isPresent(options.clearHistory) ? options.clearHistory : false,
            animated: isPresent(options.animated) ? options.animated : true,
            transition: options.transition
        };
        routerLog("NSLocationStrategy._setNavigationOptions(" +
            `${JSON.stringify(this._currentNavigationOptions)})`);
    }

    public _getOutlets(): Array<Outlet> {
        return this.outlets;
    }

    upsertOutlet(changedOutlet: UrlSegmentGroup) {
        const pathToOutlet = this.getPathToOutlet(changedOutlet);
        const outlet = this.findOutlet(pathToOutlet);

        if (!outlet) {
            this.currentOutlet = this.createOutlet(pathToOutlet, changedOutlet);
        } else if (this.updateOutlet(outlet, changedOutlet)) { // If statesByOutlet updated
            this.currentOutlet = outlet;
        }
    }

    updateOutletFrames(outlet: Outlet, frame: Frame) {
        if (outlet) {
            if (!outlet.frames.some(currentFrame => currentFrame === frame)) {
                outlet.frames.push(frame);
            }

            this.currentOutlet = outlet;
        }
    }

    removeOutlet(frame: Frame) {
        // Remove outlet only if the destroying frame is the last one int the outlet frames.
        this.outlets = this.outlets.filter(currentOutlet => {
            currentOutlet.frames = currentOutlet.frames.filter(currentFrame => currentFrame !== frame);
            return currentOutlet.frames.length;
        });
    }

    getPathToOutlet(activatedRoute: any): string {
        let pathToOutlet;
        let lastPath = activatedRoute.outlet;
        let parent = activatedRoute.parent;

        while (parent && activatedRoute.root !== parent) {
            if (parent && parent.outlet !== lastPath) {
                if (lastPath === "primary") {
                    lastPath = parent.outlet;
                } else {
                    lastPath = parent.outlet;
                    pathToOutlet = lastPath + "-" + (pathToOutlet || activatedRoute.outlet);
                }
            }

            parent = parent.parent;
        }

        return pathToOutlet || lastPath;
    }

    findOutlet(pathToOutlet: string): Outlet {
        let outlet;

        for (let index = 0; index < this.outlets.length; index++) {
            const currentOutlet = this.outlets[index];

            if (currentOutlet.pathToOutlet === pathToOutlet) {
                outlet = currentOutlet;
                break;
            }
        }

        return outlet;
    }

    private getOutletByFrame(frame: Frame) {
        let outlet;

        for (let index = 0; index < this.outlets.length; index++) {
            const currentOutlet = this.outlets[index];

            if (currentOutlet.frames.some(currentFrame => currentFrame === frame)) {
                outlet = currentOutlet;
                break;
            }
        }

        return outlet;
    }

    private updateOutlet(outlet: Outlet, segmentGroup: UrlSegmentGroup): boolean {
        const isNewPage = outlet.statesByOutlet.length === 0;
        const lastState = outlet.statesByOutlet[outlet.statesByOutlet.length - 1];

        if (!lastState || lastState.segmentGroup.toString() !== segmentGroup.toString()) {
            const locationState: LocationState = {
                isModalNavigation: false,
                segmentGroup: segmentGroup,
                isRootSegmentGroup: lastState ? lastState.isRootSegmentGroup : false,
                isPageNavigation: isNewPage
            };

            outlet.statesByOutlet.push(locationState);
            return true;
        }

        return false;
    }

    private createOutlet(pathToOutlet: string, segmentGroup: any): Outlet {
        let isRootSegmentGroup: boolean = false;

        if (!segmentGroup) {
            // Handle case where the user declares a component at path "/".
            // The url serializer doesn't parse this url as having a primary outlet.
            segmentGroup = this.currentUrlTree && this.currentUrlTree.root;
            isRootSegmentGroup = true;
        }

        const newOutlet = new Outlet(pathToOutlet);

        const locationState: LocationState = {
            isModalNavigation: false,
            segmentGroup: segmentGroup,
            isRootSegmentGroup: isRootSegmentGroup,
            isPageNavigation: true // It is a new OutletNode.
        };

        newOutlet.statesByOutlet = [locationState];
        this.outlets.push(newOutlet);

        return newOutlet;
    }

    private getSegmentGroup(pathToOutlet: string): UrlSegmentGroup {
        const pathList = pathToOutlet.split("-");
        let segmentGroup = this.currentUrlTree.root;

        for (let index = 0; index < pathList.length; index++) {
            const currentPath = pathList[index];

            if (Object.keys(segmentGroup.children).length) {
                segmentGroup = segmentGroup.children[currentPath];
            }
        }

        return segmentGroup;
    }

    // Traversal and replacement of segmentGroup.
    private updateSegmentGroup(rootNode, oldSegmentGroup: UrlSegmentGroup, newSegmentGroup: UrlSegmentGroup) {
        const queue = [];
        queue.push(rootNode);
        let currentTree = queue.shift();

        while (currentTree) {
            Object.keys(currentTree.children).forEach(outletName => {
                if (currentTree.children[outletName] === oldSegmentGroup) {
                    if (newSegmentGroup) {
                        currentTree.children[outletName] = newSegmentGroup;
                    } else {
                        delete currentTree.children[outletName];
                    }
                }
                queue.push(currentTree.children[outletName]);
            });

            currentTree = queue.shift();
        }
    }
}
