import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from "tns-core-modules/data/observable";

import { ViewContainerRefService } from "../shared/ViewContainerRefService";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { ModalComponent } from "../modal/modal.component";
import { ModalViewComponent } from "../modal-shared/modal-view.component";
import { confirm } from "ui/dialogs";

import { AppModule } from "../app.module";

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

    onNavigateSecond() {
        this.routerExtension.navigate(["second"]);
    }

    onFrameRootViewReset() {
        AppModule.root = "page-router";
        AppModule.platformRef._livesync();
    }

    onNamedFrameRootViewReset() {
        AppModule.root = "named-page-router";
        AppModule.platformRef._livesync();
    }

    onTabRootViewReset() {
        AppModule.root = "tab";
        AppModule.platformRef._livesync();
    }

    onLayoutRootViewReset() {
        AppModule.root = "layout";
        AppModule.platformRef._livesync();
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

    onShowDialog() {
        let options = {
            title: "Dialog",
            message: "Message",
            okButtonText: "Yes",
            cancelButtonText: "No"
        }

        confirm(options).then((result: boolean) => {
            console.log(result);
        })
    }
}
