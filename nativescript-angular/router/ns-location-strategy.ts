import { Injectable } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree } from "@angular/router";
import { routerLog, routerError, isLogEnabled } from "../trace";
import { NavigationTransition, Frame } from "tns-core-modules/ui/frame";
import { isPresent } from "../lang-facade";
import { FrameService } from "../platform-providers";

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
    state: any;
    title: string;
    queryParams: string;
    segmentGroup: UrlSegmentGroup;
    isRootSegmentGroup: boolean;
    isPageNavigation: boolean;
    isModalNavigation: boolean;
}

@Injectable()
export class NSLocationStrategy extends LocationStrategy {
    private statesByOutlet: { [key: string]: Array<LocationState> } = {};
    private currentUrlTree: UrlTree;
    private currentOutlet: string;
    private popStateCallbacks = new Array<(_: any) => any>();

    private _isPageNavigationBack = false;
    private _currentNavigationOptions: NavigationOptions;

    public _isModalClosing = false;
    public _isModalNavigation = false;

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

        const state = this.peekState(this.currentOutlet);
        if (!state) {
            return "/";
        }

        let tree = this.currentUrlTree;

        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (state.isRootSegmentGroup) {
            tree.root = state.segmentGroup;
        } else {
            tree.root.children[this.currentOutlet] = state.segmentGroup;
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
        const stateUrlTree: UrlTree = urlSerializer.parse(url);
        const rootOutlets = stateUrlTree.root.children;

        this.currentUrlTree = stateUrlTree;

        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (!Object.keys(rootOutlets).length) {
            const outletStates = this.statesByOutlet["primary"] = this.statesByOutlet["primary"] || [];
            const isNewPage = outletStates.length === 0;
            outletStates.push({
                state: state,
                title: title,
                queryParams: queryParams,
                segmentGroup: stateUrlTree.root,
                isRootSegmentGroup: true,
                isPageNavigation: isNewPage,
                isModalNavigation: false
            });
            this.currentOutlet = "primary";
        }

        Object.keys(rootOutlets).forEach(outletName => {
            const outletStates = this.statesByOutlet[outletName] = this.statesByOutlet[outletName] || [];
            const isNewPage = outletStates.length === 0;
            const lastState = this.peekState(outletName);

            if (!lastState || lastState.segmentGroup.toString() !== rootOutlets[outletName].toString()) {
                outletStates.push({
                    state: state,
                    title: title,
                    queryParams: queryParams,
                    segmentGroup: rootOutlets[outletName],
                    isRootSegmentGroup: false,
                    isPageNavigation: isNewPage,
                    isModalNavigation: false
                });

                this.currentOutlet = outletName;
            }
        });
    }

    replaceState(state: any, title: string, url: string, queryParams: string): void {
        const states = this.statesByOutlet[this.currentOutlet];
        if (states && states.length > 0) {
            if (isLogEnabled()) {
                routerLog("NSLocationStrategy.replaceState changing existing state: " +
                    `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            }

            const tree = this.currentUrlTree;
            if (url !== tree.toString()) {
                const urlSerializer = new DefaultUrlSerializer();
                const stateUrlTree: UrlTree = urlSerializer.parse(url);
                const rootOutlets = stateUrlTree.root.children;

                Object.keys(rootOutlets).forEach(outletName => {
                    const topState = this.peekState(outletName);

                    topState.segmentGroup = rootOutlets[outletName];
                    topState.state = state;
                    topState.title = title;
                    topState.queryParams = queryParams;
                });
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

    back(): void {
        if (this._isModalClosing) {
            const states = this.statesByOutlet[this.currentOutlet];
            // We are closing modal view
            // clear the stack until we get to the page that opened the modal view
            let state;
            let modalStatesCleared = false;
            let count = 1;

            while (!modalStatesCleared) {
                state = this.peekState(this.currentOutlet);

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

            if (isLogEnabled()) {
                routerLog(`NSLocationStrategy.back() while closing modal. States popped: ${count}`);
            }

            if (state) {
                this.callPopState(state, true);
            }
        } else if (this._isPageNavigationBack) {
            const states = this.statesByOutlet[this.currentOutlet];
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
            let state = this.peekState(this.currentOutlet);
            if (state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                if (isLogEnabled()) {
                    routerLog("NSLocationStrategy.back() while not navigating back but top" +
                        " state is page - will call frame.goBack()");
                }
                const frame = this.frameService.getFrame();
                frame.goBack();
            } else {
                // Nested navigation - just pop the state
                if (isLogEnabled()) {
                    routerLog("NSLocationStrategy.back() while not navigating back but top" +
                        " state is not page - just pop");
                }

                this.callPopState(this.statesByOutlet[this.currentOutlet].pop(), true);
            }
        }

    }

    canGoBack() {
        return this.statesByOutlet[this.currentOutlet].length > 1;
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

    private callPopState(state: LocationState, pop: boolean = true) {
        const urlSerializer = new DefaultUrlSerializer();
        const rootOutlet = this.currentUrlTree.root.children[this.currentOutlet];

        if (state && rootOutlet) {
            this.currentUrlTree.root.children[this.currentOutlet] = state.segmentGroup;
        } else {
            // when closing modal view there are scenarios (e.g. root viewContainerRef) when we need
            // to clean up the named page router outlet to make sure we will open the modal properly again if needed.
            delete this.statesByOutlet[this.currentOutlet];
            delete this.currentUrlTree.root.children[this.currentOutlet];
            this.currentOutlet = Object.keys(this.statesByOutlet)[0];
        }

        const url = urlSerializer.serialize(this.currentUrlTree);
        const change = { url: url, pop: pop };
        for (let fn of this.popStateCallbacks) {
            fn(change);
        }
    }

    private peekState(name: string) {
        const states = this.statesByOutlet[name] || [];
        if (states.length > 0) {
            return states[states.length - 1];
        }
        return null;
    }

    public toString() {
        let result = [];

        Object.keys(this.statesByOutlet).forEach(outletName => {
            const outletStates = this.statesByOutlet[outletName];
            const outletLog = outletStates
                // tslint:disable-next-line:max-line-length
                .map((v, i) => `${outletName}.${i}.[${v.isPageNavigation ? "PAGE" : "INTERNAL"}].[${v.isModalNavigation ? "MODAL" : "BASE"}] "${v.segmentGroup.toString()}"`)
                .reverse();


            result = result.concat(outletLog);
        });

        return result.join("\n");
    }

    // Methods for syncing with page navigation in PageRouterOutlet
    public _beginBackPageNavigation(name: string, frame: Frame) {
        if (this._isPageNavigationBack) {
            if (isLogEnabled()) {
                routerError("Attempted to call startGoBack while going back.");
            }
            return;
        }
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.startGoBack()");
        }
        this._isPageNavigationBack = true;

        let { cachedFrame } = this.frameService.findFrame(frame);

        if (cachedFrame) {
            this.currentOutlet = cachedFrame.rootOutlet;
        } else if (!this.frameService.containsOutlet(name)) {
            this.currentOutlet = name;
        }
    }

    public _finishBackPageNavigation() {
        if (!this._isPageNavigationBack) {
            if (isLogEnabled()) {
                routerError("Attempted to call endGoBack while not going back.");
            }
            return;
        }
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.finishBackPageNavigation()");
        }
        this._isPageNavigationBack = false;
    }

    public _isPageNavigatingBack() {
        return this._isPageNavigationBack;
    }

    public _beginModalNavigation(frame: Frame): void {
        if (isLogEnabled()) {
          routerLog("NSLocationStrategy._beginModalNavigation()");
        }

      let { cachedFrameRootOutlet } = this.frameService.findFrame(frame);

      const lastState = this.peekState(cachedFrameRootOutlet || this.currentOutlet);

      if (lastState) {
          lastState.isModalNavigation = true;
      }

      this._isModalNavigation = true;
  }

    public _beginCloseModalNavigation(): void {
        if (this._isModalClosing) {
            if (isLogEnabled()) {
                routerError("Attempted to call startCloseModal while closing modal.");
            }
            return;
        }
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.startCloseModal()");
        }
        this._isModalClosing = true;
    }

    public _finishCloseModalNavigation() {
        if (!this._isModalClosing) {
            if (isLogEnabled()) {
                routerError("Attempted to call startCloseModal while not closing modal.");
            }
            return;
        }

        if (isLogEnabled()) {
            routerLog("NSLocationStrategy.finishCloseModalNavigation()");
        }
        this._isModalNavigation = false;
        this._isModalClosing = false;
    }

    public _beginPageNavigation(name: string, frame: Frame): NavigationOptions {
        if (isLogEnabled()) {
            routerLog("NSLocationStrategy._beginPageNavigation()");
        }

        let { cachedFrame } = this.frameService.findFrame(frame);

        if (cachedFrame) {
            this.currentOutlet = cachedFrame.rootOutlet;
        } else {
            // Changing the current outlet only if navigating in non-cached root outlet.
            if (!this.frameService.containsOutlet(name) && this.statesByOutlet[name] /* ensure root outlet exists */) {
                this.currentOutlet = name;
            }

            this.frameService.addFrame(frame, name, this.currentOutlet);
        }

        const lastState = this.peekState(this.currentOutlet);
        if (lastState) {
            lastState.isPageNavigation = true;
        }

        const navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            if (isLogEnabled()) {
                routerLog("NSLocationStrategy._beginPageNavigation clearing states history");
            }
            this.statesByOutlet[this.currentOutlet] = [lastState];
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

    public _getStates(): { [key: string]: Array<LocationState> } {
        return this.statesByOutlet;
    }
}
