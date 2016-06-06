import {Component, ChangeDetectionStrategy} from '@angular/core';
import * as dialogs from "ui/dialogs";
import {ModalDialogService, ModalDialogOptions, ModalDialogHost, ModalDialogParams} from "nativescript-angular/directives/dialogs";


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
class ModalContent {
    public prompt: string;
    constructor(private params: ModalDialogParams) {
        this.prompt = params.context.message;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }
}

const TEMPLATE = `
<GridLayout rows="auto, auto, *" modal-dialog-host>
    <Button text="show component" (tap)="showModal()"></Button>
    <Button text="show component (async)" (tap)="showModalAsync()" row="1"></Button>
    
    <Label [text]="'RESULT: ' + result" row="2" margin="12"></Label>
</GridLayout>
`;

@Component({
    selector: 'modal-test',
    directives: [ModalDialogHost],
    providers: [ModalDialogService],
    template: TEMPLATE
})
export class ModalTest {
    public result: string = "---";

    constructor(private modal: ModalDialogService) { }

    public showModal() {
        const options: ModalDialogOptions = {
            context: { message: "Hello from dialog!" },
            fullscreen: true
        };

        this.modal.showModal(ModalContent, options).then((res: string) => {
            this.result = res || "empty result";
        })
    }

    public showModalAsync() {
        setTimeout(() => {
            this.showModal()
        }, 10);
    }
}

@Component({
    selector: 'modal-test-on-push',
    directives: [ModalDialogHost],
    providers: [ModalDialogService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: TEMPLATE
})
export class ModalTestWithPushStrategy {
    public result: string = "---";

    constructor(private modal: ModalDialogService) { }

    public showModal() {
        const options: ModalDialogOptions = {
            context: { message: "Hello from dialog (onPush)!" },
            fullscreen: true
        };

        this.modal.showModal(ModalContent, options).then((res: string) => {
            this.result = res || "empty result";
        })
    }

    public showModalAsync() {
        setTimeout(() => {
            this.showModal()
        }, 10);
    }
}
