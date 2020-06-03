import {
    Component,
    ChangeDetectionStrategy,
    ViewContainerRef,
    ChangeDetectorRef
} from "@angular/core";
import {
    ModalDialogService,
    ModalDialogOptions,
    ModalDialogParams
} from "@nativescript/angular/directives/dialogs";

@Component({
    selector: "modal-content",
    template: `
    <GridLayout>
        <StackLayout margin="24" horizontalAlignment="center" verticalAlignment="center">
            <Label [text]="prompt"></Label>
            <StackLayout orientation="horizontal" marginTop="12">
                <Button text="ok" (tap)="close('OK')"></Button>
                <Button text="cancel" (tap)="close('Cancel')"></Button>
            </StackLayout>
        </StackLayout>
    </GridLayout>
    `
})
export class ModalContentComponent {
    public prompt: string;
    constructor(private params: ModalDialogParams) {
        this.prompt = params.context.message;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }
}

const TEMPLATE = `
<GridLayout rows="auto, auto, *">
    <Button text="show component" (tap)="showModal()"></Button>
    <Button text="show component (async)" (tap)="showModalAsync()" row="1"></Button>
    <Label [text]="'RESULT: ' + result" row="2" margin="12"></Label>
</GridLayout>
`;

@Component({
    selector: "modal-test",
    providers: [ModalDialogService],
    template: TEMPLATE
})
export class ModalTestComponent {
    public result: string = "---";

    constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef) { }

    public showModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: { message: "Hello from dialog!" },
            fullscreen: true
        };

        this.modal.showModal(ModalContentComponent, options).then((res: string) => {
            this.result = res || "empty result";
        });
    }

    public showModalAsync() {
        setTimeout(() => {
            this.showModal();
        }, 10);
    }
}

@Component({
    selector: "modal-test-on-push",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: TEMPLATE
})
export class ModalTestWithPushStrategyComponent {
    public result: string = "---";

    constructor(
        private modal: ModalDialogService,
        private vcRef: ViewContainerRef,
        private cdRef: ChangeDetectorRef) { }

    public showModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: { message: "Hello from dialog (onPush)!" },
            fullscreen: true
        };

        this.modal.showModal(ModalContentComponent, options).then((res: string) => {
            this.result = res || "empty result";
            this.cdRef.markForCheck();
        });
    }

    public showModalAsync() {
        setTimeout(() => {
            this.showModal();
        }, 10);
    }
}
