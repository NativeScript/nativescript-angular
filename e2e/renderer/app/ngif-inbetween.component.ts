import { Component } from "@angular/core";

@Component({
    template: `
        <ActionBar title="ngIf - inbetween">
        </ActionBar>

        <StackLayout>
            <Button text="Button 1">
            </Button>

            <Label text="Label" *ngIf="show">
            </Label>

            <Button text="Button 2">
            </Button>

            <Button text="Toggle" backgroundColor="hotpink" (tap)="toggle()">
            </Button>
        </StackLayout>
    `
})
export class NgIfInbetweenComponent {
    public show = true;

    toggle() {
        this.show = !this.show;
    }
}

