import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "ModalViewContent",
    moduleId: module.id,
    template: `
    <ActionBar title="SHARED MODAL VIEW" class="action-bar">
    </ActionBar>

    <StackLayout class="page">
        <Button text="Close Modal" (tap)="onTap()"></Button>
    </StackLayout>
    `,
    styles: [`
    .action-bar, .page {
        background-color: chocolate;
    }
    `]
})
export class ModalViewContentComponent {
    constructor(private _params: ModalDialogParams) { }

    onTap(): void {
        this._params.closeCallback("return value");
    }
}