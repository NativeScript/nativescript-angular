import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogParams, ModalDialogOptions, ModalDialogService } from "@nativescript/angular/directives/dialogs";
import { RouterExtensions, PageRoute } from "@nativescript/angular/router";
import { ActivatedRoute } from "@angular/router";
import { View, ShownModallyData } from "@nativescript/core/ui/core/view"
import { confirm } from "@nativescript/core/ui/dialogs";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { NestedModalComponent } from "../modal-nested/modal-nested.component";

@Component({
    moduleId: module.id,
    selector: "modal-page",
    templateUrl: "./modal.component.html"
})
export class ModalComponent {
    public navigationVisibility: string = "collapse";

    constructor(private params: ModalDialogParams,
        private vcRef: ViewContainerRef,
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        private modal: ModalDialogService) {

        console.log("\nModalContent.constructor: " + JSON.stringify(params));
        this.navigationVisibility = params.context.navigationVisibility ? "visible" : "collapse";
    }

    close(layoutRoot: View) {
      this.modal.closeModal();
        // layoutRoot.closeModal();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        console.log("ModalContent.ngOnDestroy");
    }

    onShowingModally(args: ShownModallyData) {
        console.log("modal-page showingModally");
    }

    showDialogConfirm() {
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

    showNestedModalFrame() {
        const options: ModalDialogOptions = {
            context: {
                navigationVisibility: true,
                modalRoute: "nested-frame-modal"
            },
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalRouterComponent, options).then((res: string) => {
            console.log("nested-modal-frame closed");
        });
    }

    showNestedModal() {
        const options: ModalDialogOptions = {
            context: { navigationVisibility: false },
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(NestedModalComponent, options).then((res: string) => {
            console.log("nested-modal closed");
        });
    }

    onNavigateSecondPage() {
        this.routerExtension.navigate(["../modal-second"], { relativeTo: this.activeRoute });
    }
}
