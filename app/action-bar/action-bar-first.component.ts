import {Component} from '@angular/core';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";

@Component({
    selector: "first-action-bar",
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
export class FirstComponentActionBar {

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
