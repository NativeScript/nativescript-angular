import { Component } from "@angular/core";

import { RouterExtensions, ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "ns-lazy",
    moduleId: module.id,
    templateUrl: "./lazy.component.html",
    styleUrls: ["./lazy.component.css"]
})
export class LazyComponent {
    public isModal: boolean;

    constructor(
        private router: RouterExtensions,
        private params: ModalDialogParams
    ) {
        if (params.context.isModal) {
            this.isModal = true;
        }
    }

    public close() {
        if (this.isModal) {
            this.params.closeCallback();
        } else {
            this.router.back();
        }
    }
}
