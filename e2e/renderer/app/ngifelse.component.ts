import { Component } from "@angular/core";

@Component({
    template: `
        <ActionBar title="ngIfElse">
        </ActionBar>

        <StackLayout>
            <Button *ngIf="show; else elseClause" text="If"></Button>

            <ng-template #elseClause>
                <Button text="Else"></Button>
            </ng-template>

            <Button (tap)="toggle()" text="Toggle"></Button>
        </StackLayout>
    `
})
export class NgIfElseComponent {
    public show: boolean = true;

    toggle() {
        this.show = !this.show;
    }
}

