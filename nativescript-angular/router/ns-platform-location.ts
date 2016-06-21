import {NSLocationStrategy} from './ns-location-strategy';
import {PlatformLocation, UrlChangeListener} from '@angular/common';
import {Injectable} from '@angular/core';
import {routerLog} from "../trace";


@Injectable()
export class NativescriptPlatformLocation extends PlatformLocation {

    constructor(private locationStartegy: NSLocationStrategy) {
        super();
        routerLog("NativescriptPlatformLocation.constructor()");
    }

    getBaseHrefFromDOM(): string {
        return "/";
    }

    onPopState(fn: UrlChangeListener): void {
        routerLog("NativescriptPlatformLocation.onPopState()");
        this.locationStartegy.onPopState(fn);
    }

    onHashChange(fn: UrlChangeListener): void {
        routerLog("NativescriptPlatformLocation.onHashChange()");
    }

    get search(): string {
        routerLog("NativescriptPlatformLocation.get search()");

        return "";
    }
    get hash(): string {
        routerLog("NativescriptPlatformLocation.get hash()");

        return "";
    }
    get pathname(): string {
        routerLog("NativescriptPlatformLocation.get pathname()");
        return this.locationStartegy.path();
    }
    set pathname(newPath: string) {
        routerLog("NativescriptPlatformLocation.set pathname(): " + newPath);
    }

    pushState(state: any, title: string, url: string): void {
        routerLog("NativescriptPlatformLocation.pushState()");

        this.locationStartegy.pushState(state, title, url, null);
    }

    replaceState(state: any, title: string, url: string): void {
        routerLog("NativescriptPlatformLocation.replaceState()");
        this.locationStartegy.replaceState(state, title, url, null);
    }

    forward(): void {
        routerLog("NativescriptPlatformLocation.forward()");

        throw new Error("NativescriptPlatformLocation.forward() not implemend");
    }

    back(): void {
        routerLog("NativescriptPlatformLocation.back()");
        
        this.locationStartegy.back();
    }
}
