import { Component } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular/modal-dialog";

import { ViewContainerRefService } from "../shared/ViewContainerRefService";
import { ModalViewComponent } from "../modal-shared/modal-view.component";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-second",
    moduleId: module.id,
    template: `
    <StackLayout class="page">
        <Button text="Show Shared Modal" (tap)="onRootModalTap()"></Button>
        <Button text="go back" (tap)="onBackTap()"></Button>
        <Label text="second component"></Label>
    </StackLayout>
    `
})
export class ModalSharedSecondComponent {
    constructor(
        private _modalService: ModalDialogService,
        private _viewContainerRefService: ViewContainerRefService,
        private _routerExtensions: RouterExtensions
    ) { }

    onRootModalTap(): void {
        const options: ModalDialogOptions = {
            context: {},
            fullscreen: true,
            viewContainerRef: this._viewContainerRefService.root,
        };

        this._modalService.showModal(ModalViewComponent, options)
            .then((result: string) => {
                console.log(result);
            });
    }

    onBackTap() {
        if (this._routerExtensions.canGoBack()) {
            this._routerExtensions.back();
        }
    }
}