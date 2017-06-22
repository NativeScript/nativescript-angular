import { Component } from "@angular/core";

@Component({
    selector: "first-action-bar",
    template: `
    <ActionBar title="Title 1" automationText="title">
        <ActionItem *ngIf="show" text="action" (tap)="onTap()" [nsRouterLink]="['/second']"></ActionItem>
        <ActionItem (tap)="onShare()" ios.systemIcon="9"
            ios.position="left" android.systemIcon="ic_menu_share_holo_light" android.position="actionBar"></ActionItem>
        <ActionItem text="delete" (tap)="onDelete()"
            ios.systemIcon="16" ios.position="right" android.position="popup"></ActionItem>
    </ActionBar>
    <StackLayout verticalAlignment="center">
        <Label [text]="messageShare"></Label>
        <Label [text]="messageDelete"></Label>
    </StackLayout>
    `,
})
export class FirstActionBarComponent {

    public counterShare: number = 0;
    public counterDelete: number = 0;
    public show: boolean = true;

    public get messageShare(): string {
        if (this.counterShare === 1) {
            return this.counterShare + " share tap";
        } else {
            return this.counterShare + " share taps";
        }
    }

    public get messageDelete(): string {
        if (this.counterDelete === 1) {
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
