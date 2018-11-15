import { Component, ViewContainerRef, Input } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { ModalComponent } from "../modal/modal.component";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
import { confirm } from "tns-core-modules/ui/dialogs";

import { ViewContainerRefService } from "../shared/ViewContainerRefService";
import { ModalViewComponent } from "~/modal-shared/modal-view.component";

@Component({
    selector: "basic-nav",
    template: `
<StackLayout col="{{ col }}">
    <TextView text="Navigate to example" editable="false"></TextView>
    <Button text="Show Modal Without Frame" (tap)="onModalNoFrame()" textAlignment="left"></Button>
    <Button text="Show Modal Page With Frame" (tap)="onModalFrame()" textAlignment="left"></Button>
    <Button text="Show Shared Modal" (tap)="onRootModalTap()" textAlignment="left"></Button>
    <Button text="Show Dialog" (tap)="onShowDialog()" textAlignment="left"></Button>
</StackLayout>`
})

export class BasicsNavigationComponent {

    @Input() col: number;
    constructor(
        private modal: ModalDialogService,
        private router: Router,
        private vcf: ViewContainerRef,
        private viewContainerRefService: ViewContainerRefService) {
    }
 
    onModalNoFrame() {
        const options: ModalDialogOptions = {
            context: {
                navigationVisibility: false
            },
            fullscreen: true,
            viewContainerRef: this.vcf
        };

        this.modal.showModal(ModalComponent, options).then((res: string) => {
            console.log("modal-no-frame closed");
        });
    }

    onModalFrame() {
        const options: ModalDialogOptions = {
            context: {
                navigationVisibility: true,
                modalRoute: "modal"
            },
            fullscreen: true,
            viewContainerRef: this.vcf
        };

        this.modal.showModal(ModalRouterComponent, options).then((res: string) => {
            console.log("modal-frame closed");
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
