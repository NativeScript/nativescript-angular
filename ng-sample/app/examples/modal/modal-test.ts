import { Component, ViewContainerRef } from "@angular/core";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { ModalContent } from "./modal-content";

@Component({
    selector: "modal-test",
    template: `
    <GridLayout rows="*, auto">
        <StackLayout verticalAlignment="top" margin="12">
            <Button text="show component" (tap)="showModal(false)"></Button>
            <Button text="show component fullscreen" (tap)="showModal(true)"></Button>

            <Button text="alert" (tap)="showAlert()"></Button>
            <Button text="confirm" (tap)="showConfirm()"></Button>
            <Button text="prompt" (tap)="showPrompt()"></Button>
            <Button text="action" (tap)="showAction()"></Button>
            <Button text="login" (tap)="showLogin()"></Button>
        </StackLayout>
        <Label [text]="'RESULT: ' + result" row="1" margin="12"></Label>
    </GridLayout>
    `
})
export class ModalTest {

    public result: string = "result";

    constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef) { }

    static entries = [
        ModalContent
    ];

    static exports = [
        ModalContent
    ];

    public showModal(fullscreen: boolean) {
        const options: ModalDialogOptions = {
            context: { promptMsg: "This is the prompt message!" },
            fullscreen: fullscreen,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalContent, options).then((res: string) => {
            this.result = res || "empty result";
        });
    }

    public showAlert() {
        dialogs.alert({
            title: "Alert Title",
            message: "The name will change.",
            okButtonText: "OK"
        }).then(() => {
            this.result = "alert closed";
        });
    }

    public showConfirm() {
        dialogs.confirm({
            title: "Name",
            message: "Do you want to change the name?",
            cancelButtonText: "No",
            neutralButtonText: "Ignore",
            okButtonText: "Yes"
        }).then((confirmResult) => {
            this.result = confirmResult + "";
        });
    }

    public showPrompt() {
        dialogs.prompt({
            title: "Name",
            message: "Enter name:",
            cancelButtonText: "Cancel",
            neutralButtonText: "Ignore",
            okButtonText: "OK",
            defaultText: "John Reese",
            inputType: dialogs.inputType.text
        }).then((promptResult) => {
            this.result = promptResult.result ? promptResult.text : "no result";
        });
    }

    public showAction() {
        dialogs.action({
            message: "Choose action:",
            cancelButtonText: "Close",
            actions: ["Foo", "Bar"]
        }).then((actionResult) => {
            this.result = actionResult;
        });
    }

    public showLogin() {
        dialogs.login({
            title: "Name",
            message: "Enter name:",
            cancelButtonText: "Cancel",
            neutralButtonText: "Ignore",
            okButtonText: "OK",
            userName: "John",
            password: "Reese"
        }).then((loginResult) => {
            this.result = loginResult.result ?
                ("user: " + loginResult.userName + " pass: " + loginResult.password) :
                "no result";
        });
    }

}
