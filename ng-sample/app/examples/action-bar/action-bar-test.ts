import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';
import { Page} from "ui/page";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";
import {NS_DIRECTIVES} from "../../nativescript-angular/directives/ns-directives";

@Component({
    selector: "first",
    directives: [NS_ROUTER_DIRECTIVES, NS_DIRECTIVES],
    template: `    
    <ActionBar title="Custom Title"> 
        <ActionItem *ngIf="show" text="action" (tap)="onTap()"></ActionItem>
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
}


@Component({
    selector: "nested-componenet",
    directives: [NS_ROUTER_DIRECTIVES, NS_DIRECTIVES],
    template: `

    <action-bar-scope>
        <ActionItem *ngIf="show" text="action" (tap)="onTap()"></ActionItem>
    </action-bar-scope>

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
        <nested-componenet></nested-componenet>
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
@RouteConfig([
    { path: '/', component: FirstComponent, as: 'First' },
    { path: '/second', component: SecondComponent, as: 'Second' },
])
export class ActionBarTest {
}


