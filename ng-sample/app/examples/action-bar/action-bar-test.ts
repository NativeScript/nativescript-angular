import {Component} from '@angular/core';
//TODO: port to latest router
//import {RouteConfig} from '@angular/router-deprecated';
//import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router-deprecated/ns-router-deprecated";
const NS_ROUTER_DIRECTIVES = [];

import { Page} from "ui/page";
import {NS_DIRECTIVES} from "nativescript-angular/directives";

@Component({
    selector: "first",
    directives: [NS_ROUTER_DIRECTIVES, NS_DIRECTIVES],
    template: `    
    <ActionBar title="Custom Title"> 
        <ActionItem *ngIf="show" text="action" (tap)="onTap()"></ActionItem>
        <ActionItem ios.systemIcon="9" android.systemIcon="ic_menu_share_holo_light" (tap)="onShare()"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <Button [text]="show ? 'hide' : 'show'" (tap)="show = !show"></Button>
        <Button text="Start" [nsRouterLink]="['/Second']"></Button>
    </StackLayout>
    `,
})
class FirstComponent {
    public show: boolean = true;
    onTap() {
        console.log("FirstComponent.Tapped!");
    }
    onShare() {
        console.log("Share button tapped!");
    }
}


@Component({
    selector: "nested-component",
    directives: [NS_ROUTER_DIRECTIVES, NS_DIRECTIVES],
    template: `

    <ActionBarExtension>
        <ActionItem *ngIf="show" (tap)="onTap()">
            <Button text="CUSTOM"></Button>
        </ActionItem>
    </ActionBarExtension>

    <StackLayout verticalAlignment="center">
        <Button [text]="show ? 'hide' : 'show'" (tap)="show = !show"></Button>
    </StackLayout>
    `,
})
class NestedComponent {
    public show: boolean = true;

    onTap() {
        console.log("NestedComponent.Tapped!");
    }
}

@Component({
    selector: "second",
    directives: [NS_ROUTER_DIRECTIVES, NS_DIRECTIVES, NestedComponent],
    template: `
    <ActionBar title="Second Page Title">
        <NavigationButton text="First" android.systemIcon="ic_menu_back"></NavigationButton>
        <ActionItem text="TapMe" (tap)="onTap()"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <Label text="Second Page is Here" class="title"></Label>
        <nested-component></nested-component>
    </StackLayout>
    `,
})
class SecondComponent {
    onTap() {
        console.log("SecondComponent.Tapped!");
    }
}

@Component({
    selector: 'action-bar-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <GridLayout>
       <page-router-outlet></page-router-outlet>
    </GridLayout>
    `
})
//TODO: port to latest router
//@RouteConfig([
    //{ path: '/', component: FirstComponent, name: 'First' },
    //{ path: '/second', component: SecondComponent, name: 'Second' },
//])
export class ActionBarTest {
}


