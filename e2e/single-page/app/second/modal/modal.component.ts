import { Component } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    moduleId: module.id,
    selector: 'modal',
    templateUrl: './modal.component.html'
})

export class ModalComponent {

    constructor(private params: ModalDialogParams) {
    }

    public close() {
        this.params.closeCallback();
    }

}