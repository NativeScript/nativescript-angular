import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { EventData } from "tns-core-modules/data/observable";
import { Frame } from "tns-core-modules/ui/frame";
import { View } from "tns-core-modules/ui/core/view";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { PageRouterOutlet } from "nativescript-angular/router/page-router-outlet";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    moduleId: module.id,
    selector: "home-page",
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef, private routerExtension: RouterExtensions) { }

    public onModalFrame(args: EventData) {
        const options: ModalDialogOptions = {
            // context: null,
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalRouterComponent, options).then((res: string) => {
             console.log("MODAL SHOWN");
        });
    }
}
