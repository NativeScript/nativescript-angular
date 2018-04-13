import { Injectable } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree } from "@angular/router";
import { routerLog } from "../trace";
import { NavigationTransition } from "tns-core-modules/ui/frame";
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
    url: string;
    queryParams: string;
    segmentGroup: UrlSegmentGroup;
    isPageNavigation: boolean;
    isModalNavigation: boolean;
}

@Injectable()
export class NSLocationStrategy extends LocationStrategy {
    private statesByOutlet: { [key: string]: Array<LocationState> } = {};
    private currentUrlTree: UrlTree;
    private currentOutlet: string;
    private popStateCallbacks = new Array<(_: any) => any>();

    private _isModalClosing = false;
    private _isPageNavigationBack = false;
    private _currentNavigationOptions: NavigationOptions;


    public _isModalNavigation = false;

    constructor(private frameService: FrameService) {
        super();
        routerLog("NSLocationStrategy.constructor()");
    }

    path(): string {
        if (!this.currentUrlTree || !this.currentOutlet) {
            return "/";
        }

        const state = this.peekState(this.currentOutlet);

        this.currentUrlTree.root.children[this.currentOutlet] = state.segmentGroup;

        const urlSerializer = new DefaultUrlSerializer();
        const url = urlSerializer.serialize(this.currentUrlTree);
        const result = url;
        routerLog("NSLocationStrategy.path(): " + result);
        return result;
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
        const stateUrlTree: UrlTree = urlSerializer.parse(url);
        const rootOutlets = stateUrlTree.root.children;

        this.currentUrlTree = stateUrlTree;

        Object.keys(rootOutlets).forEach(outletName => {
            const outletStates = this.statesByOutlet[outletName] = this.statesByOutlet[outletName] || [];
            const isNewPage = outletStates.length === 0;
            const lastState = this.peekState(outletName);

            if (!lastState || lastState.toString() !== rootOutlets[outletName].toString()) {
                outletStates.push({
                    state: state,
                    title: title,
                    url: url,
                    queryParams: queryParams,
                    segmentGroup: rootOutlets[outletName],
                    isPageNavigation: isNewPage,
                    isModalNavigation: false
                });
            }
        });
    }

    replaceState(state: any, title: string, url: string, queryParams: string): void {
        const states = this.statesByOutlet[this.currentOutlet];
        if (states && states.length > 0) {
            routerLog("NSLocationStrategy.replaceState changing existing state: " +
                `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);


            // !!!!! In all the e2e tests this method replaces the url with the same url
            // !!!!! making it obsolete. The only scenario is the initial call that is handled
            // !!!!! in the else statement.

            // const urlSerializer = new DefaultUrlSerializer();
            // const stateUrlTree: UrlTree = urlSerializer.parse(url);
            // const rootOutlets = stateUrlTree.root.children;

            // Object.keys(rootOutlets).forEach(outletName => {
            //     const outletStates = this.statesByOutlet[outletName] = this.statesByOutlet[outletName] || [];
            //     const topState = this.peekState(outletName);

            //     topState.segmentGroup = rootOutlets[outletName];
            //     topState.state = state;
            //     topState.title = title;
            //     topState.url = url;
            //     topState.queryParams = queryParams;
            // });
        } else {
            routerLog("NSLocationStrategy.replaceState pushing new state: " +
                `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
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
            let state = states.pop();
            let count = 1;

            while (!(state.isModalNavigation)) {
                state = states.pop();
                count++;
            }

            states.push(state);
            routerLog("NSLocationStrategy.back() while closing modal. States popped: " + count);
            this.callPopState(state, true);
        } else if (this._isPageNavigationBack) {
            const states = this.statesByOutlet[this.currentOutlet];
            // We are navigating to the previous page
            // clear the stack until we get to a page navigation state
            let state = states.pop();
            let count = 1;

            while (!(state.isPageNavigation)) {
                state = states.pop();
                count++;
            }

            routerLog("NSLocationStrategy.back() while navigating back. States popped: " + count);
            this.callPopState(state, true);
        } else {
            let state = this.peekState(this.currentOutlet);
            if (state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                routerLog("NSLocationStrategy.back() while not navigating back but top" +
                    " state is page - will call frame.goBack()");
                const frame = this.frameService.getFrame();
                frame.goBack();
            } else {
                // Nested navigation - just pop the state
                routerLog("NSLocationStrategy.back() while not navigating back but top" +
                    " state is not page - just pop");
                this.callPopState(this.statesByOutlet[this.currentOutlet].pop(), true);
            }
        }

    }

    canGoBack() {
        return this.statesByOutlet[this.currentOutlet].length > 1;
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
        this.currentUrlTree.root.children[this.currentOutlet] = state.segmentGroup;
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
    public _beginBackPageNavigation(name: string) {
        routerLog("NSLocationStrategy.startGoBack()");
        if (this._isPageNavigationBack) {
            throw new Error("Calling startGoBack while going back.");
        }
        this._isPageNavigationBack = true;
        this.currentOutlet = name;
    }

    public _finishBackPageNavigation() {
        routerLog("NSLocationStrategy.finishBackPageNavigation()");
        if (!this._isPageNavigationBack) {
            throw new Error("Calling endGoBack while not going back.");
        }
        this._isPageNavigationBack = false;
    }

    public _isPageNavigatingBack() {
        return this._isPageNavigationBack;
    }

    public _beginModalNavigation(): void {
        routerLog("NSLocationStrategy._beginModalNavigation()");
        const lastState = this.peekState(this.currentOutlet);

        if (lastState) {
            lastState.isModalNavigation = true;
        }

        this._isModalNavigation = true;
    }

    public _beginCloseModalNavigation(): void {
        routerLog("NSLocationStrategy.startCloseModal()");
        if (this._isModalClosing) {
            throw new Error("Calling startCloseModal while closing modal.");
        }
        this._isModalClosing = true;
    }

    public _finishCloseModalNavigation() {
        routerLog("NSLocationStrategy.finishCloseModalNavigation()");
        if (!this._isModalClosing) {
            throw new Error("Calling startCloseModal while not closing modal.");
        }
        this._isModalClosing = false;
    }

    public _beginPageNavigation(name: string): NavigationOptions {
        routerLog("NSLocationStrategy._beginPageNavigation()");
        const lastState = this.peekState(name);
        if (lastState) {
            lastState.isPageNavigation = true;
        }

        this.currentOutlet = name;

        const navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            routerLog("NSLocationStrategy._beginPageNavigation clearing states history");
            this.statesByOutlet[name] = [lastState];
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

    public _getStates(): { [key: string]: Array<LocationState> } {
        return this.statesByOutlet;
    }
}
