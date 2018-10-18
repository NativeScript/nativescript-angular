import { Component } from "@angular/core";
import { View, EventData } from "tns-core-modules/ui/core/view"
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    moduleId: module.id,
    selector: "modal-second-page",
    templateUrl: "./modal-second.component.html"
})
export class ModalSecondComponent {
    constructor(private routerExtension: RouterExtensions) { }

    onLoaded(args: EventData) {
        console.log("modal-second loaded");
    }

    goBack() {
        this.routerExtension.back();
    }

    close(layoutRoot: View) {
        layoutRoot.closeModal();
    }
}
