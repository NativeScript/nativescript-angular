import { Component, ViewContainerRef } from "@angular/core";
import * as dialogs from "ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { ModalContent } from "./modal-content";
import { ModalTest } from "./modal-test";

@Component({
    selector: "modal-nested-test",
    template: `
        <modal-test></modal-test>
    `
})
export class ModalNestedTest {

    static entries = [
        ModalContent
    ];

    static exports = [
        ModalTest
    ];

}