import { NSLocationStrategy } from "./ns-location-strategy";
import { PlatformLocation, LocationChangeListener } from "@angular/common";
import { Injectable } from "@angular/core";
import { routerLog } from "../trace";


@Injectable()
export class NativescriptPlatformLocation extends PlatformLocation {

    constructor(private locationStartegy: NSLocationStrategy) {
        super();
        routerLog("NativescriptPlatformLocation.constructor()");
    }

    getBaseHrefFromDOM(): string {
        return "/";
    }

    onPopState(fn: LocationChangeListener): void {
        this.locationStartegy.onPopState(fn);
    }

    onHashChange(_fn: LocationChangeListener): void {
    }

    get search(): string {
        return "";
    }
    get hash(): string {
        return "";
    }
    get pathname(): string {
        return this.locationStartegy.path();
    }
    set pathname(_newPath: string) {
        throw new Error("NativescriptPlatformLocation set pathname - not implemented");
    }

    pushState(state: any, title: string, url: string): void {
        this.locationStartegy.pushState(state, title, url, null);
    }

    replaceState(state: any, title: string, url: string): void {
        this.locationStartegy.replaceState(state, title, url, null);
    }

    forward(): void {
        throw new Error("NativescriptPlatformLocation.forward() - not implemented");
    }

    back(): void {
        this.locationStartegy.back();
    }
}
