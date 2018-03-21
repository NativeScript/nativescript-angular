import { Component, Input } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

@Component({
    selector: "modal-content",
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

    @Input() public prompt: string;

    constructor(private params: ModalDialogParams) {
        console.log("ModalContent.constructor: " + JSON.stringify(params));
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
