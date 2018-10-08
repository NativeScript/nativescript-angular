import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { View, EventData } from "ui/core/view"
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    moduleId: module.id,
    selector: "modal-second-page",
    templateUrl: "./modal-second.component.html"
})
export class ModalSecondComponent {
    constructor(private routerExtension: RouterExtensions, private activeRoute: ActivatedRoute) { }

    onLoaded() {
        console.log("modal-second loaded");
    }

    goBack() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }

    close(layoutRoot: View) {
        layoutRoot.closeModal();
    }
}
