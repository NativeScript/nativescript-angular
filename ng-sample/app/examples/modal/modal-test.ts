import {Component, DynamicComponentLoader, ElementRef, Injector, provide, Type, Injectable, Host, ComponentRef} from 'angular2/core';
import {Page, ShownModallyData} from 'ui/page';
import {View} from 'ui/core/view';
import * as dialogs from "ui/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogParams} from "../../nativescript-angular/services/dialogs";

@Component({
    selector: 'modal-content',
    template: `
    <StackLayout margin="24" horizontalAlignment="center" verticalAlignment="center">
        <Label [text]="prompt"></Label>
        <StackLayout orientation="horizontal" marginTop="12">
            <Button text="ok" (tap)="close('OK')"></Button>
            <Button text="cancel" (tap)="close('Cancel')"></Button>
        </StackLayout>
    </StackLayout>
    `
})
export class ModalContent {
    public prompt: string;
    constructor(private params: ModalDialogParams) {
        console.log("ModalContent.constructor: " + JSON.stringify(params))
        this.prompt = params.context.promptMsg;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

    ngOnInit() {
        console.log("ModalContent.ngOnInit");

    }

    ngOnDestroy() {
        console.log("ModalContent.ngOnDestroy");
    }
}

@Component({
    selector: 'modal-test',
    directives: [],
    providers: [ModalDialogService],
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

    constructor(
        private elementRef: ElementRef,
        private modal: ModalDialogService) {
    }

    public dialog() {
        dialogs.alert({ title: "alert title", message: "alert message", okButtonText: "KO, NE!" });
    }

    public showModal(fullscreen: boolean) {
        var options = new ModalDialogOptions({ promptMsg: "This is the prompt message!" }, fullscreen);

        this.modal.showModal(ModalContent, this.elementRef, options).then((res: string) => {
            this.result = res || "empty result";
        })
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
            this.result = loginResult.result ? ("user: " + loginResult.userName + " pass: " + loginResult.password) : "no result";
        });
    }
}
