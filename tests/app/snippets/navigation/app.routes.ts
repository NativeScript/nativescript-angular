import {FirstComponent, SecondComponent} from "./navigation-common";
// >> router-config-all
import {RouterConfig} from '@angular/router';
import {nsProvideRouter} from 'nativescript-angular/router';

const routes: RouterConfig = [
    { path: "", redirectTo: "/first", terminal: true },
    { path: "first", component: FirstComponent },
    { path: "second", component: SecondComponent },
];

export const APP_ROUTER_PROVIDERS = [
    nsProvideRouter(routes, { enableTracing: false })
];
// << router-config-all