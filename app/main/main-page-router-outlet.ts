import { Component } from "@angular/core";
import { RouterConfig } from '@angular/router';
import { NS_ROUTER_DIRECTIVES, nsProvideRouter } from "nativescript-angular/router";

import { FirstComponentActionBar } from "../action-bar/action-bar-first.component";
import { SecondComponentActionBar } from "../action-bar/action-bar-second.component";

import { AppComponent } from "../template/app.component";

import { FirstComponent } from "../components/first.component";
import { SecondComponent } from "../components/second.component";
import { NavigationTestRouter, NavigationSubRoutes } from "../router/router-outlet";

import { BindingComponent } from "../binding/binding-page";

import { ListViewComponent } from "../listView/commonTemplate/list-view-page";
import { ListViewControlComponent } from "../listView/customTemplate/list-view-item-template";
import { ListViewAsyncPipeComponent } from "../listView/asyncPipeTemplate/async-pipe-template";
import { ListViewMainPageComponent } from "../listView/listViewMainPage/list-view-main-page";

import { ModalTest, ModalTestWithPushStrategy } from "../modal/modal-dialog.component";

import { NavigationOptionsComponent } from "../navigation-options/navigation-options.component";
import { NavigationInfoComponent } from "../navigation-options/navigation-info.component";


@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="Main Component" class="title"></Label>

        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="Template" [nsRouterLink]="['/template']"></Button>
            <Button text="Router" [nsRouterLink]="['/router']"></Button>
        </StackLayout>

        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="First" [nsRouterLink]="['/first']"></Button>      
            <Button text="Second" [nsRouterLink]="['/second']"></Button>
        </StackLayout>

        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="ActionBar1" [nsRouterLink]="['/first-action-bar']"></Button>
            <Button text="ActionBar2" [nsRouterLink]="['/second-action-bar']"></Button>
        </StackLayout>

        <Button text="Binding" [nsRouterLink]="['/binding']"></Button>     

        <Button text="ListViewExamples" [nsRouterLink]="['/listView']"></Button>  
        
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="modal" [nsRouterLink]="['/modal']"></Button>
            <Button text="modal(onPush)" [nsRouterLink]="['/modal-on-push']"></Button> 
        </StackLayout> 

        <Button text="nav-options" [nsRouterLink]="['/nav-options']"></Button>
    </StackLayout>
    `,
})
class MainComponent { }

@Component({
    selector: 'navigation-main',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
export class NavigationMainPageRouter { }


const routes: RouterConfig = [
    { path: '', component: MainComponent },
    { path: 'template', component: AppComponent },
    { path: 'router', component: NavigationTestRouter, children: NavigationSubRoutes },
    { path: 'first', component: FirstComponent },
    { path: 'second', component: SecondComponent },

    { path: 'first-action-bar', component: FirstComponentActionBar },
    { path: 'second-action-bar', component: SecondComponentActionBar },
    { path: 'binding', component: BindingComponent },

    { path: 'listView', component: ListViewMainPageComponent },
    { path: 'listView/commonTemplate', component: ListViewComponent },
    { path: 'listView/customTemplate', component: ListViewControlComponent },
    { path: 'listView/asyncPipeTemplate', component: ListViewAsyncPipeComponent },

    { path: 'modal', component: ModalTest },
    { path: 'modal-on-push', component: ModalTestWithPushStrategy },

    { path: 'nav-options', component: NavigationOptionsComponent },
    { path: 'nav-info', component: NavigationInfoComponent }
];

export var MainRouterProviders = nsProvideRouter(routes, { enableTracing: false });