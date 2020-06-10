import { Component } from "@angular/core";
import { View } from "@nativescript/core/ui/core/view"
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";

@Component({
    moduleId: module.id,
    selector: "modal-second-page",
    templateUrl: "./modal-second.component.html"
})
export class ModalSecondComponent {
    constructor(private routerExtension: RouterExtensions, private activeRoute: ActivatedRoute) { }

    onLoaded(args) {
        console.log("modal-second loaded");
    }

    goBack() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }

    close(layoutRoot: View) {
        layoutRoot.closeModal();
    }
}
