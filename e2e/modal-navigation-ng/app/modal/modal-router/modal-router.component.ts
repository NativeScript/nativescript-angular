import { Component } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-router",
    templateUrl: "app.component.html",
})

export class ModalRouterComponent {
    constructor(router: Router, location: NSLocationStrategy, private routerExtension: RouterExtensions, private activeRoute: ActivatedRoute) {
        router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                console.log("[ROUTER]: " + e.toString());
                console.log(location.toString());
            }
        });
    }

    ngOnInit() {
        this.routerExtension.navigate(["modal"], { relativeTo: this.activeRoute });
    }
}
