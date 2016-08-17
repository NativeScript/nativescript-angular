import { Component } from "@angular/core";
import { RouterConfig } from '@angular/router';
import { NS_ROUTER_DIRECTIVES, nsProvideRouter} from "nativescript-angular/router"

import {FirstComponent} from "./first/first.component";
import {SecondComponent} from "./second/second.component";

@Component({
    selector: 'livesync-app-test',
    template: `<page-router-outlet></page-router-outlet>`
})
export class LivesyncApp {
    static routes = [
        { path: "", component: FirstComponent },
        { path: "second", component: SecondComponent },
    ];

    static entries = [
        FirstComponent,
        SecondComponent,
    ];
}
