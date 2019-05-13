import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "nav-options",
    template: `
    <StackLayout>
        <Button text="clear-history" [nsRouterLink]="['/nav-info']" [clearHistory]="true"></Button>
        <Button text="page-transitions" (tap)="flipToNextPage()"></Button>
    </StackLayout>
  `
})

export class NavigationOptionsComponent {

    constructor(private routerExtensions: RouterExtensions) { }

    flipToNextPage() {
        this.routerExtensions.navigate(["/nav-info"], {
            transition: {
                name: "flip",
                duration: 17000,
                curve: "linear"
            }
        });
    }
}
