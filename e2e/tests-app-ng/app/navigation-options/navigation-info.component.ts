import { Component } from "@angular/core";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";
import { Frame } from "tns-core-modules/ui/frame";

@Component({
    selector: "nav-info",
    template: `
    <StackLayout>
        <Label [text]="'frameStack: ' + frameStack" ></Label>
        <Label [text]="'locationStack: ' + locationStack" ></Label>

        <Button text="update" (tap)="update()"></Button>
        <Button text="back to main" [nsRouterLink]="['/']" [clearHistory]="true"></Button>
    </StackLayout>
  `
})
export class NavigationInfoComponent {
    public frameStack: number = -1;
    public locationStack: number = -1;

    constructor(private frame: Frame, private strategy: NSLocationStrategy) { }

    update() {
        // If history is cleared: frameStack = 0, locationStack = 1
        this.frameStack = this.frame.backStack.length;
        this.locationStack = this.strategy.findOutlet("primary").states.length;
    }
}
