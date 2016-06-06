import { Component } from "@angular/core";
import { RouteConfig } from '@angular/router-deprecated';
import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";
import { ActionBarTest } from "../action-bar/action-bar-test";
import { FirstComponentActionBar } from "../action-bar/action-bar-first.component";
import { SecondComponentActionBar } from "../action-bar/action-bar-second.component";
import { AppComponent } from "../template/app.component";
import { FirstComponent } from "../components/first.component";
import { SecondComponent } from "../components/second.component";
import { NavigationTestRouter } from "../router/router-outlet";
import { BindingComponent } from "../binding/binding-page";
import { ListViewComponent } from "../listView/commonTemplate/list-view-page";
import { ListViewControlComponent } from "../listView/customTemplate/list-view-item-template";
import { ListViewAsyncPipeComponent } from "../listView/asyncPipeTemplate/async-pipe-template"
import { ListViewMainPageComponent } from "../listView/listViewMainPage/list-view-main-page"

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
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="ActionBar1" [nsRouterLink]="['FirstActionBar']"></Button>
            <Button text="ActionBar2" [nsRouterLink]="['SecondActionBar']"></Button>
        </StackLayout>
        <Button text="Binding" [nsRouterLink]="['Binding']"></Button>
        <Button text="ListViewTests" [nsRouterLink]="['ListViewMainPage']"></Button>        
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
    // { path: '/action-bar-test/...', component: ActionBarTest, name: 'ActionBar' },
    { path: '/first-action-bar', component: FirstComponentActionBar, name: 'FirstActionBar' },
    { path: '/second-action-bar', component: SecondComponentActionBar, name: 'SecondActionBar' },
    { path: '/binding', component: BindingComponent, name: 'Binding' },
    { path: '/listView/commonTemplate', component: ListViewComponent, name: 'ListView' },
    { path: '/listView/listViewMainPage', component: ListViewMainPageComponent, name: 'ListViewMainPage' },
    { path: '/listView/customTemplate', component: ListViewControlComponent, name: 'ListViewCustomTemplate' },
    { path: '/listView/asyncPipeTemplate', component: ListViewAsyncPipeComponent, name: 'ListViewAsyncPipe' },

])
export class NavigationMainPageRouter { }