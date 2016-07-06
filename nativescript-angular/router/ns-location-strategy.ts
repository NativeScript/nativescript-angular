import application = require("application");
import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { routerLog } from "../trace";
import { Frame, NavigationTransition } from "ui/frame";
import {isPresent} from '@angular/core/src/facade/lang';

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
    state: any,
    title: string,
    url: string,
    queryParams: string,
    isPageNavigation: boolean
}

@Injectable()
export class NSLocationStrategy extends LocationStrategy {
    private states = new Array<LocationState>();
    private popStateCallbacks = new Array<(_: any) => any>();

    private _isPageNavigationgBack = false;
    private _isPageNavigatingForward: boolean = false;
    private _currentNavigationOptions: NavigationOptions;

    constructor(private frame: Frame) {
        super();
        routerLog("NSLocationStrategy.constructor()");
    }

    path(): string {
        let state = this.peekState();
        const result = state ? state.url : "/";
        routerLog("NSLocationStrategy.path(): " + result);
        return result;
    }

    prepareExternalUrl(internal: string): string {
        routerLog("NSLocationStrategy.prepareExternalUrl() internal: " + internal);
        return internal;
    }


    pushState(state: any, title: string, url: string, queryParams: string): void {
        routerLog(`NSLocationStrategy.pushState state: ${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}, isPageNavigation: ${this._isPageNavigatingForward}`);
        this.pushStateInternal(state, title, url, queryParams);
    }

    pushStateInternal(state: any, title: string, url: string, queryParams: string): void {
        let isNewPage = this._isPageNavigatingForward || this.states.length === 0;

        const navOptions = this._currentNavigationOptions || defaultNavOptions;

        if (navOptions.clearHistory) {
            routerLog("NSLocationStrategy.pushStateInternal clearing states history");
            this.states.length = 0;
        }

        this._currentNavigationOptions = undefined;

        this._isPageNavigatingForward = false;
        this.states.push({
            state: state,
            title: title,
            url: url,
            queryParams: queryParams,
            isPageNavigation: isNewPage
        });
    }

    replaceState(state: any, title: string, url: string, queryParams: string): void {
        if (this.states.length > 0) {
            routerLog(`NSLocationStrategy.replaceState changing exisitng state: ${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            const topState = this.peekState();
            topState.state = state;
            topState.title = title;
            topState.url = url;
            topState.queryParams = queryParams;
        }
        else {
            routerLog(`NSLocationStrategy.replaceState pushing new state: ${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            this.pushStateInternal(state, title, url, queryParams);
        }
    }

    forward(): void {
        throw new Error("NSLocationStrategy.forward() - not implemented");
    }

    back(): void {
        if (this._isPageNavigationgBack) {
            // We are navigating to the previous page 
            // clear the stack until we get to a page navigation state
            let state = this.states.pop();
            let count = 1;

            while (!(state.isPageNavigation)) {
                state = this.states.pop();
                count++;
            }

            routerLog("NSLocationStrategy.back() while navigating back. States popped: " + count);
            this.callPopState(state, true);
        } else {
            let state = this.peekState();
            if (state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                routerLog("NSLocationStrategy.back() while not navigating back but top state is page - will call frame.goback()");
                this.frame.goBack();
            } else {
                // Nested navigation - just pop the state
                routerLog("NSLocationStrategy.back() while not navigating back but top state is not page - just pop");
                this.callPopState(this.states.pop(), true);
            }
        }

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
        const change = { url: state.url, pop: pop };
        for (let fn of this.popStateCallbacks) {
            fn(change);
        }
    }

    private peekState(): LocationState {
        if (this.states.length > 0) {
            return this.states[this.states.length - 1];
        }
        return null;
    }

    public toString() {
        return this.states
            .map((v, i) => `${i}.[${v.isPageNavigation ? "PAGE" : "INTERNAL"}] "${v.url}"`)
            .reverse()
            .join("\n");
    }

    // Methods for syncing with page navigation in PageRouterOutlet
    public _beginBackPageNavigation() {
        routerLog("NSLocationStrategy.startGoBack()");
        if (this._isPageNavigationgBack) {
            throw new Error("Calling startGoBack while going back.");
        }
        this._isPageNavigationgBack = true;
    }

    public _finishBackPageNavigation() {
        routerLog("NSLocationStrategy.finishBackPageNavigation()");
        if (!this._isPageNavigationgBack) {
            throw new Error("Calling endGoBack while not going back.");
        }
        this._isPageNavigationgBack = false;
    }

    public _isPageNavigatingBack() {
        return this._isPageNavigationgBack;
    }

    public _beginPageNavigation(): NavigationOptions {
        routerLog("NSLocationStrategy.navigateToNewPage()");
        if (this._isPageNavigatingForward) {
            throw new Error("Calling navigateToNewPage while already navigating to new page.");
        }


        this._isPageNavigatingForward = true;
        return this._currentNavigationOptions || defaultNavOptions;
    }

    public _setNavigationOptions(options: NavigationOptions) {
        this._currentNavigationOptions = {
            clearHistory: isPresent(options.clearHistory) ? options.clearHistory : false,
            animated: isPresent(options.animated) ? options.animated : true,
            transition: options.transition
        };
    }

    public _getSatates(): Array<LocationState> {
        return this.states.slice();
    }
}
