import { Component, ViewContainerRef } from "@angular/core";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/directives/dialogs";
import { FirstComponent, SecondComponent, ThirdComponent, PageRouterOutletAppComponent } from "../router/page-router-outlet-test";

@Component({
    selector: "modal-router-outlet-test",
    template: `
    <GridLayout rows="*, auto">
        <StackLayout verticalAlignment="top" margin="12">
            <Button text="show component" (tap)="showModal(false)"></Button>
            <Button text="show component fullscreen" (tap)="showModal(true)"></Button>
        </StackLayout>
        <Label [text]="'RESULT: ' + result" row="1" margin="12"></Label>
    </GridLayout>
    `
})
export class ModalPageRouterOutletTest {

    public result: string = "result";

    constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef) { }

    static entries = [
        PageRouterOutletAppComponent,
    ];

    static exports = [
        FirstComponent,
        SecondComponent,
        ThirdComponent
    ];

    static routes = PageRouterOutletAppComponent.routes;

    public showModal(fullscreen: boolean) {
        const options: ModalDialogOptions = {
            fullscreen: fullscreen,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(PageRouterOutletAppComponent, options).then((res: string) => {
            this.result = res || "empty result";
        });
    }

}
