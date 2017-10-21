import { Component } from "@angular/core";

@Component({
    template: `
        <ActionBarExtension>
            <ActionItem (tap)="show = !show" text="toggle">
            </ActionItem>

            <ActionItem *ngIf="show" text="conditional">
            </ActionItem>
        </ActionBarExtension>
  `
})
export class ActionBarExtensionComponent {
    public show = true;
}
