// make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {Component, ViewContainerRef} from "@angular/core";
import {Page} from "ui/page";
import {topmost} from "ui/frame";
import {ModalDialogParams, ModalDialogService} from "nativescript-angular/directives/dialogs";

import {device, platformNames} from "platform";

import {ComponentFixture} from "@angular/core/testing";
import {nTestBedRender, nTestBedAfterEach, nTestBedBeforeEach} from "nativescript-angular/testing";
const CLOSE_WAIT = (device.os === platformNames.ios) ? 1000 : 0;

@Component({
    selector: "modal-comp",
    template: `<Label text="this is modal component"></Label>`
})
export class ModalComponent {
    constructor(public params: ModalDialogParams, private page: Page) {
        page.on("shownModally", () => {
            const result = this.params.context;
            this.params.closeCallback(result);
        });
    }
}

@Component({
    selector: "fail-comp",
    providers: [ModalDialogService],
    template: `<Label text="This app is doomed"></Label>`

})
export class FailComponent {
    constructor(public service: ModalDialogService) {
    }
}

@Component({
    selector: "sucess-comp",
    providers: [ModalDialogService],
    template: `
    <GridLayout margin="20">
        <Label text="Modal dialogs"></Label>
    </GridLayout>`
})
export class SuccessComponent {
    constructor(public service: ModalDialogService, public vcRef: ViewContainerRef) {
    }
}

describe("modal-dialog", () => {

    beforeEach(nTestBedBeforeEach([FailComponent, SuccessComponent], [], [], [ModalComponent]));
    afterEach(nTestBedAfterEach());
    before((done) => {
        // HACK: Wait for the navigations from the test runner app
        // Remove the setTimeout when test runner start tests on page.navigatedTo
        setTimeout(() => done(), 1000);
    });

    afterEach(() => {
        const page = topmost().currentPage;
        if (page && page.modal) {
            console.log("Warning: closing a leftover modal page!");
            page.modal.closeModal();
        }
    });


    it("showModal throws when there is no viewContainer provided", (done) => {
        nTestBedRender(FailComponent)
            .then((fixture: ComponentFixture<FailComponent>) => {
                const service = <ModalDialogService>fixture.componentRef.instance.service;
                assert.throws(() => service.showModal(ModalComponent, {}),
                    "No viewContainerRef: Make sure you pass viewContainerRef in ModalDialogOptions."
                );
            })
            .then(() => done())
            .catch((e) => done(e));
    });

    it("showModal succeeds when there is viewContainer provided", (done) => {
        nTestBedRender(SuccessComponent)
            .then((fixture: ComponentFixture<SuccessComponent>) => {
                const service = <ModalDialogService>fixture.componentRef.instance.service;
                const comp = <SuccessComponent>fixture.componentRef.instance;
                return service.showModal(ModalComponent, {viewContainerRef: comp.vcRef});
            })
            .then((res) => setTimeout(done, CLOSE_WAIT)) // wait for the dialog to close in IOS
            .catch((e) => done(e));
    });

    it("showModal passes modal params and gets result when resolved", (done) => {
        const context = {property: "my context"};
        nTestBedRender(SuccessComponent)
            .then((fixture: ComponentFixture<SuccessComponent>) => {
                const service = <ModalDialogService>fixture.componentRef.instance.service;
                const comp = <SuccessComponent>fixture.componentRef.instance;
                return service.showModal(ModalComponent, {
                    viewContainerRef: comp.vcRef,
                    context: context
                });
            })
            .then((res) => {
                assert.strictEqual(res, context);
                setTimeout(done, CLOSE_WAIT); // wait for the dialog to close in IOS
            })
            .catch((e) => done(e));
    });
});
