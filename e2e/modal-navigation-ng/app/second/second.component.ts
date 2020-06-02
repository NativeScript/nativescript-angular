import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular/directives/dialogs";
import { EventData } from "@nativescript/core/data/observable";
import { Frame } from "@nativescript/core/ui/frame";
import { View } from "@nativescript/core/ui/core/view";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { PageRouterOutlet } from "@nativescript/angular/router/page-router-outlet";
import { RouterExtensions } from "@nativescript/angular/router";
import { ModalComponent } from "../modal/modal.component";
import { AppModule } from "../app.module";
@Component({
    moduleId: module.id,
    selector: "second-page",
    templateUrl: "./second.component.html"
})
export class SecondComponent {
    constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef, private routerExtension: RouterExtensions) { }

    onModalNoFrame() {
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

    onModalFrame() {
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

    goBack() {
        this.routerExtension.back();
    }
}
