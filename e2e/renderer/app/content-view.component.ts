import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="Content View">
        <ActionItem (tap)="toggle()">
            <Button text="Toggle"></Button>
        </ActionItem>
    </ActionBar>

    <Placeholder *ngIf="show; then thenTemplate else elseTemplate">
    </Placeholder>

    <ContentView>
        <ng-template #thenTemplate>
            <Label text="Then"></Label>
        </ng-template>

        <ng-template #elseTemplate>
            <Label text="Else"></Label>
        </ng-template>
    </ContentView>
  `
})
export class ContentViewComponent {
    public show = true;

    toggle() {
        this.show = !this.show;
    }
}

