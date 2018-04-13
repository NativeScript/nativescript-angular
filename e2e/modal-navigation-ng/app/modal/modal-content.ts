import { Component, Input } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { View } from "ui/core/view"

@Component({
    selector: "modal-content",
    template: `
    <GridLayout #rootLayout margin="24" horizontalAlignment="center" verticalAlignment="center" rows="*, auto">
        <StackLayout>
          <page-router-outlet></page-router-outlet>
        </StackLayout>    
        <StackLayout row="1" orientation="horizontal" marginTop="12">
                <Button text="back" (tap)="back()"></Button>
                <Button text="ok" (tap)="close('OK')"></Button>
                <Button text="cancel" (tap)="close(rootLayout)"></Button>
        </StackLayout>
    </GridLayout>
    `
})
export class ModalContent {

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
        // this.params.closeCallback(res);
    }

    ngOnInit() {
        this.nav.navigate(["items"], { relativeTo: this.activeRoute });
        console.log("ModalContent.ngOnInit");
    }

    ngOnDestroy() {
        console.log("ModalContent.ngOnDestroy");
    }

}
