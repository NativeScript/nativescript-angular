import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild } from "@angular/core";
import { TabViewDirective } from "nativescript-angular/directives";
import { Router, NavigationEnd } from "@angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";


@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    private isInitialNavigation = true;

    @ViewChild(TabViewDirective) tabView: TabViewDirective;

    constructor(router: Router, location: NSLocationStrategy) {
        router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.isInitialNavigation = false;
                console.log("[ROUTER]: " + e.toString());
                console.log(location.toString());
            }
        })
    }
}
