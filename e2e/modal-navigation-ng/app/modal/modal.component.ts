import { Component, Input } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { View } from "ui/core/view"
import { confirm } from "ui/dialogs";

@Component({
    moduleId: module.id,
    selector: "modal-page",
    templateUrl: "./modal.component.html"
})
export class ModalComponent {

    @Input() public prompt: string;
    public yes: boolean = true;

    constructor(private params: ModalDialogParams, private nav: RouterExtensions, private activeRoute: ActivatedRoute) {
        console.log("ModalContent.constructor: " + JSON.stringify(params));
        this.prompt = params.context.promptMsg;
    }

    public back() {
        this.nav.back();
    }

    public close(layoutRoot: View) {
        layoutRoot.closeModal();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        console.log("ModalContent.ngOnDestroy");
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
}
