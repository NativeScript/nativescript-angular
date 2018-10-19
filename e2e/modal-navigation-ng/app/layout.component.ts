import { Component, ViewContainerRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { ModalComponent } from "./modal/modal.component";
import { ModalViewComponent } from "./modal-shared/modal-view.component";
import { ModalRouterComponent } from "./modal/modal-router/modal-router.component";
import { confirm } from "tns-core-modules/ui/dialogs";

import { AppModule } from "./app.module";

import { ViewContainerRefService } from "./shared/ViewContainerRefService";

@Component({
    selector: "ns-layout",
    templateUrl: "layout.component.html",
})

export class LayoutComponent {
    constructor(
        private modal: ModalDialogService,
        private router: Router,
        private location: NSLocationStrategy,
        private vcRef: ViewContainerRef,
        private _viewContainerRefService: ViewContainerRefService) {
        router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                console.log("[ROUTER]: " + e.toString());
                console.log(location.toString());
            }
        });

        this._viewContainerRefService.root = this.vcRef;
    }

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
