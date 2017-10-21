import { Component } from "@angular/core";

@Component({
    selector: "ng-if-then-else",
    template: `
        <ActionBar title="ngIf Then Else">
        </ActionBar>

        <StackLayout>
            <Placeholder *ngIf="show; then thenTemplate else elseTemplate">
            </Placeholder>

            <ng-template #thenTemplate>
                <Label text="Then"></Label>
            </ng-template>

            <ng-template #elseTemplate>
                <Label text="Else"></Label>
            </ng-template>

            <Button text="Toggle" (tap)="toggle()"></Button>
        </StackLayout>
    `
})
export class NgIfThenElseComponent {
    public show: boolean = true;

    toggle() {
        this.show = !this.show;
    }
}


