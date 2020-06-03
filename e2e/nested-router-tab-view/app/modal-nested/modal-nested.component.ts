import { Component } from "@angular/core";
import { View, ShownModallyData } from "@nativescript/core/ui/core/view"
import { ModalDialogParams } from "@nativescript/angular/directives/dialogs";

@Component({
    moduleId: module.id,
    selector: "modal-nested-page",
    templateUrl: "./modal-nested.component.html"
})
export class NestedModalComponent {
    public navigationVisibility: string = "collapse";

    constructor(private params: ModalDialogParams) {

        console.log("ModalNestedContent.constructor: " + JSON.stringify(params));
        this.navigationVisibility = params.context.navigationVisibility ? "visible" : "collapse";
    }

    close(layoutRoot: View) {
        layoutRoot.closeModal();
    }

    onShowingModally(args: ShownModallyData) {
        console.log("modal-page showingModally");
    }
}
