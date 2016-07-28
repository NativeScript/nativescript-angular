import {Component} from '@angular/core';
import {NS_ROUTER_DIRECTIVES, RouterExtensions} from "nativescript-angular/router";
import {NSLocationStrategy} from "nativescript-angular/router/ns-location-strategy";
import {Frame} from "ui/frame";


@Component({
    selector: 'nav-info',
    directives: [NS_ROUTER_DIRECTIVES],
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
    private frameStack: number = -1;
    private locationStack: number = -1;

    constructor(private frame: Frame, private strategy: NSLocationStrategy) { }

    update() {
        // If history is cleared: frameStack = 0, locationStack = 1
        this.frameStack = this.frame.backStack.length;
        this.locationStack = this.strategy._getSatates().length;
    }
}