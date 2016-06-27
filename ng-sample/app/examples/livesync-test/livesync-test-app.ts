import { Component } from "@angular/core";
import { RouterConfig } from '@angular/router';
import { NS_ROUTER_DIRECTIVES, nsProvideRouter} from "nativescript-angular/router"

import {FirstComponent} from "./first/first.component";
import {SecondComponent} from "./second/second.component";

@Component({
    selector: 'livesync-app-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
export class LivesyncApp { }

const routes: RouterConfig = [
    { path: "", component: FirstComponent },
    { path: "second", component: SecondComponent },
];

export const LivesyncTestRouterProviders = [
    nsProvideRouter(routes, { enableTracing: false })
];