import { Injectable } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree } from "@angular/router";
import { routerLog, routerError, isLogEnabled } from "../trace";
import { NavigationTransition, Frame } from "tns-core-modules/ui/frame";
import { isPresent } from "../lang-facade";
import { FrameService } from "../platform-providers";

export class Outlet {
    showingModal: boolean;
    modalNavigationDepth: number;
    parent: Outlet;
    isPageNavigationBack: boolean;
    outletKeys: Array<string>;
    pathByOutlets: string;
    statesByOutlet: Array<LocationState> = [];
    frame: Frame;

    // Used in reuse-strategy by its children to determine if they should be detached too.
    shouldDetach: boolean = true;
    constructor(outletKey: string, pathByOutlets: string, modalNavigationDepth?: number) {
        this.outletKeys = [outletKey];
        this.isPageNavigationBack = false;
        this.showingModal = false;
        this.modalNavigationDepth = modalNavigationDepth || 0;
        this.pathByOutlets = pathByOutlets;
    }

    peekState(): LocationState {
        if (this.statesByOutlet.length > 0) {
            return this.statesByOutlet[this.statesByOutlet.length - 1];
        }
        return null;
    }

    containsLastState(stateUrl: string): boolean {
        const lastState = this.peekState();
        return lastState && lastState.segmentGroup.toString() === stateUrl;
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
    isRootSegmentGroup: boolean;
    isPageNavigation: boolean;
}

@Injectable()
export class NSLocationStrategy extends LocationStrategy {
    private outlets: Array<Outlet> = [];
    private currentOutlet: Outlet;

    private popStateCallbacks = new Array<(_: any) => any>();
    private _currentNavigationOptions: NavigationOptions;
    private currentUrlTree: UrlTree;

    public _modalNavigationDepth = 0;

    constructor(private frameService: FrameService) {
        super();
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.constructor()");
        }
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
        let changedOutlet = this.getSegmentGroup(this.currentOutlet.pathByOutlets);

        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (state.isRootSegmentGroup) {
            tree.root = state.segmentGroup;
        } else if (changedOutlet) {
            // tslint:disable-next-line:max-line-length
            this.updateSegmentGroup(tree.root, changedOutlet, state.segmentGroup);
        }

        const urlSerializer = new DefaultUrlSerializer();
        const url = urlSerializer.serialize(tree);
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.path(): " + url);
        }
        return url;
    }

    prepareExternalUrl(internal: string): string {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.prepareExternalUrl() internal: " + internal);
        }
        return internal;
    }

    pushState(state: any, title: string, url: string, queryParams: string): void {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.pushState state: " +
                `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
        }
        this.pushStateInternal(state, title, url, queryParams);
    }

    pushStateInternal(state: any, title: string, url: string, queryParams: string): void {
        const urlSerializer = new DefaultUrlSerializer();
        this.currentUrlTree = urlSerializer.parse(url);
        const urlTreeRoot = this.currentUrlTree.root;

        if (!Object.keys(urlTreeRoot.children).length) {
            // Handle case where the user declares a component at path "/".
            // The url serializer doesn't parse this url as having a primary outlet.
            const rootOutlet = this.createOutlet("primary", null, null);
            this.currentOutlet = rootOutlet;
        } else {
            const queue = [];
            queue.push(urlTreeRoot);
            let currentTree = queue.shift();

            while (currentTree) {
                Object.keys(currentTree.children).forEach(outletName => {
                    const currentSegmentGroup = currentTree.children[outletName];
                    currentSegmentGroup.outlet = outletName;
                    currentSegmentGroup.root = urlTreeRoot;

                    let outletKey = this.getSegmentGroupFullPath(currentTree) + outletName;
                    let outlet = this.findOutletByKey(outletKey);
                    const parentOutletName = currentTree.outlet || "";
                    const parentOutletKey = this.getSegmentGroupFullPath(currentTree.parent) + parentOutletName;
                    const parentOutlet = this.findOutletByKey(parentOutletKey);

                    const containsLastState = outlet && outlet.containsLastState(currentSegmentGroup.toString());
                    if (!outlet) {
                        // tslint:disable-next-line:max-line-length
                        outlet = this.createOutlet(outletKey, currentSegmentGroup, parentOutlet, this._modalNavigationDepth);
                        this.currentOutlet = outlet;
                    } else if (this._modalNavigationDepth > 0 && outlet.showingModal && !containsLastState) {
                        // Navigation inside modal view.
                        this.upsertModalOutlet(outlet, currentSegmentGroup);
                    } else {
                        outlet.parent = parentOutlet;

                        if (this.updateStates(outlet, currentSegmentGroup)) {
                            this.currentOutlet = outlet; // If states updated
                        }
                    }

                    queue.push(currentTree.children[outletName]);
                });

                currentTree = queue.shift();
            }
        }
    }

    replaceState(state: any, title: string, url: string, queryParams: string): void {
        const states = this.currentOutlet && this.currentOutlet.statesByOutlet;

        if (states && states.length > 0) {
            if (isLogEnabled()) {
                routerLog("NSLocationStrategy.replaceState changing existing state: " +
                    `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            }
        } else {
            if (isLogEnabled()) {
                routerLog("NSLocationStrategy.replaceState pushing new state: " +
                    `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            }
            this.pushStateInternal(state, title, url, queryParams);
        }
    }

    forward(): void {
        throw new Error("NSLocationStrategy.forward() - not implemented");
    }

    back(outlet?: Outlet): void {
        this.currentOutlet = outlet || this.currentOutlet;

        if (this.currentOutlet.isPageNavigationBack) {
            const states = this.currentOutlet.statesByOutlet;
            // We are navigating to the previous page
            // clear the stack until we get to a page navigation state
            let state = states.pop();
            let count = 1;

            while (!state.isPageNavigation) {
                state = states.pop();
                count++;
            }

            if (isLogEnabled()) {
                routerLog(`NSLocationStrategy.back() while navigating back. States popped: ${count}`);
            }
            this.callPopState(state, true);
        } else {
            let state = this.currentOutlet.peekState();
            if (state && state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                if (isLogEnabled()) {
                    routerLog("NSLocationStrategy.back() while not navigating back but top" +
                        " state is page - will call frame.goBack()");
                }

                if (!outlet) {
                    const topmostFrame = this.frameService.getFrame();
                    this.currentOutlet = this.getOutletByFrame(topmostFrame);
                }
                this.currentOutlet.frame.goBack();
            } else {
                // Nested navigation - just pop the state
                if (isLogEnabled()) {
                    routerLog("NSLocationStrategy.back() while not navigating back but top" +
                        " state is not page - just pop");
                }

                this.callPopState(this.currentOutlet.statesByOutlet.pop(), true);
            }
        }
    }

    canGoBack(outlet?: Outlet) {
        outlet = outlet || this.currentOutlet;
        return outlet.statesByOutlet.length > 1;
    }

    onPopState(fn: (_: any) => any): void {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.onPopState");
        }
        this.popStateCallbacks.push(fn);
    }

    getBaseHref(): string {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.getBaseHref()");
        }
        return "";
    }

    private callPopState(state: LocationState, pop: boolean = true, outlet?: Outlet) {
        outlet = outlet || this.currentOutlet;
        const urlSerializer = new DefaultUrlSerializer();
        let changedOutlet = this.getSegmentGroup(outlet.pathByOutlets);

        if (state && changedOutlet) {
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, state.segmentGroup);
        } else if (changedOutlet) {
            // when closing modal view there are scenarios (e.g. root viewContainerRef) when we need
            // to clean up the named page router outlet to make sure we will open the modal properly again if needed.
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
                .map((v, i) => `${outlet.outletKeys}.${i}.[${v.isPageNavigation ? "PAGE" : "INTERNAL"}].[${outlet.modalNavigationDepth ? "MODAL" : "BASE"}] "${v.segmentGroup.toString()}"`)
                .reverse();

            result = result.concat(outletLog);
        });

        return result.join("\n");
    }

    // Methods for syncing with page navigation in PageRouterOutlet
    public _beginBackPageNavigation(frame: Frame) {
        const outlet: Outlet = this.getOutletByFrame(frame);

        if (!outlet || outlet.isPageNavigationBack) {
            if (isLogEnabled()) {
                routerError("Attempted to call startGoBack while going back.");
            }
            return;
        }

        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.startGoBack()");
        }
        outlet.isPageNavigationBack = true;

        this.currentOutlet = outlet;
    }

    public _finishBackPageNavigation(frame: Frame) {
        const outlet: Outlet = this.getOutletByFrame(frame);

        if (!outlet || !outlet.isPageNavigationBack) {
            if (isLogEnabled()) {
                routerError("Attempted to call endGoBack while not going back.");
            }
            return;
        }

        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.finishBackPageNavigation()");
        }
        outlet.isPageNavigationBack = false;
    }

    public _beginModalNavigation(frame: Frame): void {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy._beginModalNavigation()");
        }

        this.currentOutlet = this.getOutletByFrame(frame);
        this.currentOutlet.showingModal = true;
        this._modalNavigationDepth++;
    }

    public _finishCloseModalNavigation() {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.finishCloseModalNavigation()");
        }
        this._modalNavigationDepth--;

        this.currentOutlet = this.findOutletByModal(this._modalNavigationDepth, true) || this.currentOutlet;
        this.currentOutlet.showingModal = false;

        this.callPopState(this.currentOutlet.peekState(), false);
    }

    public _beginPageNavigation(frame: Frame): NavigationOptions {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy._beginPageNavigation()");
        }

        this.currentOutlet = this.getOutletByFrame(frame);
        const lastState = this.currentOutlet.peekState();

        if (lastState) {
            lastState.isPageNavigation = true;
        }

        const navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            if (isLogEnabled()) {
                routerLog("NSLocationStrategy._beginPageNavigation clearing states history");
            }
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

        if (isLogEnabled()) {
            routerLog("NSLocationStrategy._setNavigationOptions(" +
                `${JSON.stringify(this._currentNavigationOptions)})`);
        }
    }

    public _getOutlets(): Array<Outlet> {
        return this.outlets;
    }

    updateOutletFrame(outlet: Outlet, frame: Frame) {
        outlet.frame = frame;
        this.currentOutlet = outlet;
    }

    clearOutlet(frame: Frame) {
        this.outlets = this.outlets.filter(currentOutlet => {
            // Remove current outlet, if it's named p-r-o, from the url tree.
            const isEqualToCurrent = currentOutlet.pathByOutlets === this.currentOutlet.pathByOutlets;
            const isModalOutlet = currentOutlet.modalNavigationDepth > 0;

            if (currentOutlet.frame === frame && isModalOutlet && !isEqualToCurrent) {
                this.callPopState(null, true, currentOutlet);
            }
            return currentOutlet.frame !== frame;
        });
    }

    getSegmentGroupFullPath(segmentGroup: UrlSegmentGroup): string {
        let fullPath = "";

        while (segmentGroup) {
            const url = segmentGroup.toString();
            fullPath = fullPath ? (url ? url + "/" : url) + fullPath : url;
            segmentGroup = segmentGroup.parent;
        }

        return fullPath;
    }

    getRouteFullPath(currentRoute: any): string {
        const outletName = currentRoute.outlet;
        let fullPath;

        currentRoute = currentRoute.parent;
        while (currentRoute) {
            const urls = (currentRoute.url.value || currentRoute.url);
            let url = urls;

            if (Array.isArray(urls)) {
                url = url.join("/");
            }

            fullPath = fullPath ? (url ? url + "/" : url) + fullPath : url;
            currentRoute = currentRoute.parent;
        }

        return fullPath ? fullPath + outletName : outletName;
    }


    getPathByOutlets(urlSegmentGroup: any): string {
        if (!urlSegmentGroup) {
            return "";
        }

        let pathToOutlet;
        let lastPath = urlSegmentGroup.outlet || "primary";
        let parent = urlSegmentGroup.parent;

        while (parent && urlSegmentGroup.root !== parent) {
            if (parent && parent.outlet !== lastPath) {
                if (lastPath === "primary") {
                    lastPath = parent.outlet;
                } else {
                    lastPath = parent.outlet;
                    pathToOutlet = lastPath + "-" + (pathToOutlet || urlSegmentGroup.outlet);
                }
            }

            parent = parent.parent;
        }

        return pathToOutlet || lastPath;
    }

    findOutletByModal(modalNavigation: number, isShowingModal?: boolean): Outlet {
        return this.outlets.find((outlet) => {
            let isEqual = outlet.modalNavigationDepth === modalNavigation;
            return isShowingModal ? isEqual && outlet.showingModal : isEqual;
        });
    }

    findOutletByOutletPath(pathByOutlets: string): Outlet {
        return this.outlets.find((outlet) => outlet.pathByOutlets === pathByOutlets);
    }

    findOutletByKey(outletKey: string): Outlet {
        return this.outlets.find((outlet) => outlet.outletKeys.indexOf(outletKey) > -1);
    }

    private getOutletByFrame(frame: Frame): Outlet {
        let outlet;

        for (let index = 0; index < this.outlets.length; index++) {
            const currentOutlet = this.outlets[index];

            if (currentOutlet.frame === frame) {
                outlet = currentOutlet;
                break;
            }
        }

        return outlet;
    }

    private updateStates(outlet: Outlet, currentSegmentGroup: UrlSegmentGroup): boolean {
        const isNewPage = outlet.statesByOutlet.length === 0;
        const lastState = outlet.statesByOutlet[outlet.statesByOutlet.length - 1];
        const equalStateUrls = outlet.containsLastState(currentSegmentGroup.toString());

        const locationState: LocationState = {
            segmentGroup: currentSegmentGroup,
            isRootSegmentGroup: lastState ? lastState.isRootSegmentGroup : false,
            isPageNavigation: isNewPage
        };

        if (!lastState || !equalStateUrls) {
            outlet.statesByOutlet.push(locationState);

            if (this._modalNavigationDepth === 0 && !outlet.showingModal) {
                this.updateParentsStates(outlet, currentSegmentGroup.parent);
            }

            return true;
        }

        return false;
    }

    private updateParentsStates(outlet: Outlet, newSegmentGroup: UrlSegmentGroup) {
        let parentOutlet = outlet.parent;

        // Update parents lastState segmentGroups
        while (parentOutlet && newSegmentGroup) {
            const state = parentOutlet.peekState();

            if (state) {
                state.segmentGroup = newSegmentGroup;
                newSegmentGroup = newSegmentGroup.parent;
                parentOutlet = parentOutlet.parent;
            }
        }
    }

    private createOutlet(outletKey: string, segmentGroup: any, parent: Outlet, modalNavigation?: number): Outlet {
        let isRootSegmentGroup: boolean = false;

        if (!segmentGroup) {
            // Handle case where the user declares a component at path "/".
            // The url serializer doesn't parse this url as having a primary outlet.
            segmentGroup = this.currentUrlTree && this.currentUrlTree.root;
            isRootSegmentGroup = true;
        }

        const pathByOutlets = this.getPathByOutlets(segmentGroup);
        const newOutlet = new Outlet(outletKey, pathByOutlets, modalNavigation);

        const locationState: LocationState = {
            segmentGroup: segmentGroup,
            isRootSegmentGroup: isRootSegmentGroup,
            isPageNavigation: true // It is a new OutletNode.
        };

        newOutlet.statesByOutlet = [locationState];
        newOutlet.parent = parent;
        this.outlets.push(newOutlet);

        return newOutlet;
    }

    private getSegmentGroup(pathByOutlets: string): UrlSegmentGroup {
        const pathList = pathByOutlets.split("-");
        let segmentGroup = this.currentUrlTree.root;

        for (let index = 0; index < pathList.length; index++) {
            const currentPath = pathList[index];
            const childrenCount = Object.keys(segmentGroup.children).length;

            if (childrenCount && segmentGroup.children[currentPath]) {
                segmentGroup = segmentGroup.children[currentPath];
            } else {
                segmentGroup = null;
                break;
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

    private upsertModalOutlet(parentOutlet: Outlet, segmentedGroup: UrlSegmentGroup) {
        let currentModalOutlet = this.findOutletByModal(this._modalNavigationDepth);

        // We want to treat every p-r-o as a standalone Outlet.
        if (!currentModalOutlet) {
            if (this._modalNavigationDepth > 1) {
                // The parent of the current Outlet should be the previous opened modal (if any).
                parentOutlet = this.findOutletByModal(this._modalNavigationDepth - 1);
            }

            // No currentModalOutlet available when opening 'primary' p-r-o.
            const outletName = "primary";
            const outletKey = parentOutlet.peekState().segmentGroup.toString() + outletName;
            currentModalOutlet = this.createOutlet(outletKey, segmentedGroup, parentOutlet, this._modalNavigationDepth);
            this.currentOutlet = currentModalOutlet;
        } else if (this.updateStates(currentModalOutlet, segmentedGroup)) {
            this.currentOutlet = currentModalOutlet; // If states updated
        }
    }
}
