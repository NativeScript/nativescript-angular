import { Component } from "@angular/core";

@Component({
    template: `
        <ActionBar title="ngIf - no layout">
            <ActionItem (tap)="toggle()">
                <Button text="Toggle"></Button>
            </ActionItem>
        </ActionBar>

        <Button *ngIf="!show" text="false"></Button>
        <ng-template [ngIf]="show">
            <Button text="true"></Button>
        </ng-template>
    `
})
export class NgIfNoLayoutComponent {
    public show = false;

    toggle() {
        this.show = !this.show;
    }
}

