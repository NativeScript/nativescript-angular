import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from "tns-core-modules/data/observable";

import { ViewContainerRefService } from "../shared/ViewContainerRefService";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { ModalComponent } from "../modal/modal.component";
import { ModalViewComponent } from "../modal-shared/modal-view.component";

@Component({
    moduleId: module.id,
    selector: "home-page",
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    constructor(
        private modal: ModalDialogService, 
        private vcRef: ViewContainerRef, 
        private viewContainerRefService: ViewContainerRefService,
        private routerExtension: RouterExtensions) { }

    onModalNoFrame(args: EventData) {
        const options: ModalDialogOptions = {
            context: {
                navigationVisibility: false
            },
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalComponent, options).then((res: string) => {
            console.log("moda-no-frame closed");
        });
    }

    onModalFrame(args: EventData) {
        const options: ModalDialogOptions = {
            context: {
                navigationVisibility: true,
                modalRoute: "modal"
            },
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalRouterComponent, options).then((res: string) => {
            console.log("moda-frame closed");
        });
    }

    onNavigateSecond(args: EventData) {
        this.routerExtension.navigate(["second"]);
    }

    onFrameRootViewReset(args: EventData) {
        
    }

    onRootModalTap(): void {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRefService.root,
            context: {},
            fullscreen: true
        };

        this.modal.showModal(ModalViewComponent, options)
            .then((result: string) => {
                console.log(result);
            });
    }
}
