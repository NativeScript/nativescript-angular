import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    constructor(router: Router, location: NSLocationStrategy) {
        router.events.subscribe(e => {
            // console.log("[ROUTER]: " + e.toString());

            if (e instanceof NavigationEnd) {
                console.log("[ROUTER]: " + e.toString());
               console.log(location.toString());
            }
        });
    }
}
