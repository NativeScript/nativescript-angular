import { Component } from "@angular/core";

@Component({
  template: `
    <ActionBar title="Content View">
        <ActionItem (tap)="toggle()">
            <Button text="Toggle"></Button>
        </ActionItem>
    </ActionBar>

    <StackLayout *ngIf="show; then thenTemplate else elseTemplate">
    </StackLayout>

    <ng-template #thenTemplate>
        <Label text="Then"></Label>
    </ng-template>

    <ng-template #elseTemplate>
        <Label text="Else"></Label>
    </ng-template>
  `
})
export class ContentViewComponent {
    public show = true;

    toggle() {
        this.show = !this.show;
    }
}

