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
import {BindingComponent} from "../binding/binding-page";
import {ModalTest, ModalTestWithPushStrategy} from "../modal/modal-dialog.component";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    styles: [ 'button { margin: 0 6 }' ],
    template: `
    <StackLayout>
        <Label text="Main Component" class="title"></Label>
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="Template" [nsRouterLink]="['Template']"></Button>
            <Button text="Router" [nsRouterLink]="['Router']"></Button>
        </StackLayout>
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="First" [nsRouterLink]="['First']"></Button>      
            <Button text="Second" [nsRouterLink]="['Second']"></Button>
        </StackLayout>
        <!--<Button text="ActionBar" [nsRouterLink]="['ActionBar']"></Button>-->
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="ActionBar1" [nsRouterLink]="['FirstActionBar']"></Button>
            <Button text="ActionBar2" [nsRouterLink]="['SecondActionBar']"></Button>
        </StackLayout>
        <Button text="Binding" [nsRouterLink]="['Binding']"></Button>      
        <StackLayout orientation="horizontal" horizontalAlignment="center">
            <Button text="modal" [nsRouterLink]="['Modal']"></Button>
            <Button text="modal(onPush)" [nsRouterLink]="['ModalWithPushStrategy']"></Button>
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
    // { path: '/action-bar-test/...', component: ActionBarTest, name: 'ActionBar' },
    { path: '/first-action-bar', component: FirstComponentActionBar, name: 'FirstActionBar' },
    { path: '/second-action-bar', component: SecondComponentActionBar, name: 'SecondActionBar' },
    { path: '/binding', component: BindingComponent, name: 'Binding' },
    { path: '/modal', component: ModalTest, name: 'Modal' },
    { path: '/modal-on-push', component: ModalTestWithPushStrategy, name: 'ModalWithPushStrategy' },

])
export class NavigationMainPageRouter { }