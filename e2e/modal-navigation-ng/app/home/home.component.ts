import { Component, ViewContainerRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "modal-test",
    template: `
    <GridLayout rows="*, auto">
        <Button text="got to modal page" (tap)="gotToModal()"></Button>
    </GridLayout>
    `
})
export class HomeComponent {

    public result: string = "result";

    constructor(private _routerExtensions: RouterExtensions, private vcRef: ViewContainerRef) { }

    public gotToModal() {
        this._routerExtensions.navigate(["/modal"]); //{clearHistory: true}
    }
}
