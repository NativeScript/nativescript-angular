import {Component} from "@angular/core";
import {RouteConfig} from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {ActionBarTest} from "../action-bar/action-bar-test";
import {FirstComponentActionBar} from "../action-bar/action-bar-first.component";
import {SecondComponentActionBar} from "../action-bar/action-bar-second.component";
import {AppComponent} from "../template/app.component";
import {FirstComponent} from "../components/first.component";
import {SecondComponent} from "../components/second.component";
import {NavigationTestRouter} from "../router/router-outlet";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="Main Component" class="title"></Label>
        <Button text="Template" [nsRouterLink]="['Template']"></Button>
        <Button text="First" [nsRouterLink]="['First']"></Button>      
        <Button text="Second" [nsRouterLink]="['Second']"></Button>
        <Button text="Router" [nsRouterLink]="['Router']"></Button>
        <Button text="ActionBar" [nsRouterLink]="['ActionBar']"></Button>
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="ActionBar1" [nsRouterLink]="['FirstActionBar']"></Button>
            <Button text="ActionBar2" [nsRouterLink]="['SecondActionBar']"></Button>
        </StackLayout>
    </StackLayout>
    `,
})
class MainComponent { }

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
    { path: '/router/...', component: NavigationTestRouter, name: 'Router' },
    { path: '/action-bar-test/...', component: ActionBarTest, name: 'ActionBar' },
    { path: '/first-action-bar', component: FirstComponentActionBar, name: 'FirstActionBar' },
    { path: '/second-action-bar', component: SecondComponentActionBar, name: 'SecondActionBar' },
])
export class NavigationMainPageRouter { }