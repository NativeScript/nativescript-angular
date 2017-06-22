import { Component } from "@angular/core";

@Component({
    selector: "first",
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <Button text="GO TO SECOND" [nsRouterLink]="['../second']" class="link"></Button>
    </StackLayout>`
})
export class FirstComponent { }
