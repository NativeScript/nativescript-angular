import application = require("application");
import { LocationStrategy } from '@angular/common';
import { NgZone, ApplicationRef, Inject, forwardRef } from '@angular/core';
import { routerLog } from "../trace";
import { topmost } from "ui/frame";

interface LocationState {
    state: any,
    title: string,
    url: string,
    queryParams: string,
    isPageNavigation: boolean
}

export class NSLocationStrategy extends LocationStrategy {
    private states = new Array<LocationState>();
    private popStateCallbacks = new Array<(_: any) => any>();

    private _isPageNavigationgBack = false;
    private _isPageNavigatingForward: boolean = false;

    path(): string {
        routerLog("NSLocationStrategy.path()");
        let state = this.peekState();
        return state ? state.url : "/";
    }

    prepareExternalUrl(internal: string): string {
        routerLog("NSLocationStrategy.prepareExternalUrl() internal: " + internal);
        return internal;
    }

    pushState(state: any, title: string, url: string, queryParams: string): void {
        routerLog(`NSLocationStrategy.pushState state: ${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);

        let isNewPage = this._isPageNavigatingForward;
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
        routerLog(`NSLocationStrategy.replaceState state: ${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
        throw new Error("Not implemented");
    }

    forward(): void {
        routerLog("NSLocationStrategy.forward");
        throw new Error("Not implemented");
    }

    back(): void {
        if (this._isPageNavigationgBack) {
            // We are navigating to the previous page 
            // clear the stack until we get to a page navigation state
            let state = this.states.pop();
            let count = 1;
            while (!state.isPageNavigation) {
                state = this.states.pop();
                count++;
            }
            routerLog("NSLocationStrategy.back() while navigating back. States popped: " + count)
            this.callPopState(state, true);
        } else {
            let state = this.peekState();
            if (state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                routerLog("NSLocationStrategy.back() while not navigating back but top state is page - will call frame.goback()")
                topmost().goBack();
            } else {
                // Nested navigation - just pop the state
                routerLog("NSLocationStrategy.back() while not navigating back but top state is not page - just pop")
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
        var change = { url: state.url, pop: pop };
        for (var fn of this.popStateCallbacks) {
            fn(change);
        }
    }

    private peekState(): LocationState {
        if (this.states.length > 0) {
            return this.states[this.states.length - 1];
        }
        return null;
    }

    // Methods for syncing with page navigation in PageRouterOutlet
    public beginBackPageNavigation() {
        routerLog("NSLocationStrategy.startGoBack()");
        if (this._isPageNavigationgBack) {
            throw new Error("Calling startGoBack while going back.")
        }
        this._isPageNavigationgBack = true;
    }

    public finishBackPageNavigation() {
        routerLog("NSLocationStrategy.finishBackPageNavigation()");
        if (!this._isPageNavigationgBack) {
            throw new Error("Calling endGoBack while not going back.")
        }
        this._isPageNavigationgBack = false;
    }

    public isPageNavigatingBack() {
        return this._isPageNavigationgBack;
    }

    public navigateToNewPage() {
        routerLog("NSLocationStrategy.navigateToNewPage()");
        if (this._isPageNavigatingForward) {
            throw new Error("Calling navigateToNewPage while already navigating to new page.")
        }
        this._isPageNavigatingForward = true;
    }
}
