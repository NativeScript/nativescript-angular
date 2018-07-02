import { Component, ViewContainerRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";

import { ViewContainerRefService } from "./shared/ViewContainerRefService";

@Component({
    selector: "named-router",
    templateUrl: "named-router.component.html",
})

export class NamedRouterComponent {
    constructor(
        router: Router, 
        location: NSLocationStrategy,
        private _vcRef: ViewContainerRef,
        private _viewContainerRefService: ViewContainerRefService) {
        router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                console.log("[ROUTER]: " + e.toString());
               console.log(location.toString());
            }
        });

        this._viewContainerRefService.root = this._vcRef;
    }
}
