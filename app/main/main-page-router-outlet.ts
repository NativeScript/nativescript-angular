import {Component} from "@angular/core";
import {RouteConfig} from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {AppComponent} from "../template/app.component";
import {MainComponent} from "./main.component";
import {FirstComponent} from "../components/first.component";
import {SecondComponent} from "../components/second.component";
import {NavigationTestRouter} from "../router/router-outlet";

@Component({
    selector: 'navigation-main',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
@RouteConfig([
    { path: '/main', component: MainComponent, name: 'Main', useAsDefault: true },
    { path: '/template', component: AppComponent, name: 'Template' },
    { path: '/first', component: FirstComponent, name: 'First' },
    { path: '/second', component: SecondComponent, name: 'Second' },
    { path: '/router/...', component: NavigationTestRouter, name: 'Router' }
])
export class NavigationMainPageRouter {}