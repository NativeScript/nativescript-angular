import {Component} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";
import {Page} from "ui/page";

@Component({
    selector: "first",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <ActionBar title="Title 1"> 
        <ActionItem *ngIf="show" text="action" (tap)="onTap()" [nsRouterLink]="['Second']"></ActionItem>
        <ActionItem  (tap)="onShare()" ios.systemIcon="9" ios.position="left" 
            android.systemIcon="ic_menu_share_holo_light" android.position="actionBar"></ActionItem>
        <ActionItem (tap)="onDelete()" ios.systemIcon="16" ios.position="right"
            android.position="popup" text="delete"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <Label [text]="messageShare"></Label>
        <Label [text]="messageDelete"></Label>
    </StackLayout>
    `,
})
class FirstComponent {

    public counterShare: number = 0;
    public counterDelete: number = 0;
    public show: boolean = true;

    public get messageShare(): string {
        if (this.counterShare == 1) {
            return this.counterShare + " share tap";
        } else {
            return this.counterShare + " share taps";
        }
    }

    public get messageDelete(): string {
        if (this.counterDelete == 1) {
            return this.counterDelete + " delete tap";
        } else {
            return this.counterDelete + " delete taps";
        }
    }

    public onShare() {
        this.counterShare++;
        console.log("Share button tapped!");
    }

    public onTap() {
        console.log("FirstComponent.Tapped!");
    }

    public onDelete() {
        this.counterDelete++;
        console.log("Delete button tapped!");
    }
}

@Component({
    selector: "nested-component",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <ActionBarExtension>
        <ActionItem *ngIf="show" (tap)="onTap()">
            <Button text="CUSTOM"></Button>
        </ActionItem>
    </ActionBarExtension>

    <StackLayout orientation="horizontal" horizontalAlignment="center">
        <Button [text]="show ? 'hide' : 'show'" (tap)="show = !show"></Button>
        <Label [text]="message"></Label>
    </StackLayout>
    `,
})
class NestedComponent {

    public counter: number = 0;
    public show: boolean = true;

    public get message(): string {
        if (this.counter == 1) {
            return this.counter + " custom tap";
        } else {
            return this.counter + " custom taps";
        }
    }

    public onTap() {
        this.counter++;
        console.log("NestedComponent.Tapped!");
    }
}

@Component({
    selector: "second",
    directives: [NS_ROUTER_DIRECTIVES, NestedComponent],
    template: `
    <ActionBar title="Title 2">
        <NavigationButton text="First" android.systemIcon="ic_menu_back"></NavigationButton>
        <ActionItem [text]="message"></ActionItem>      
        <ActionItem text="TAP" (tap)="onTap()"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <nested-component></nested-component>
    </StackLayout>
    `,
})
class SecondComponent {

    public counter: number = 0;

    public get message(): string {
        if (this.counter == 1) {
            return this.counter + " tap";
        } else {
            return this.counter + " taps";
        }
    }

    public onTap() {
        this.counter++;
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
    `,
})
@RouteConfig([
    { path: '/first', component: FirstComponent, name: 'First', useAsDefault: true },
    { path: '/second', component: SecondComponent, name: 'Second' },
])
export class ActionBarTest { }