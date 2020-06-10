import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular";
import { EventData } from "@nativescript/core";
import { Frame } from "@nativescript/core";
import { View } from "@nativescript/core";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { RouterExtensions } from "@nativescript/angular";
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
