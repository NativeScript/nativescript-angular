// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { NgModule, Component, ViewContainerRef } from "@angular/core";
import { Page } from "@nativescript/core/ui/page";
import { topmost } from "@nativescript/core/ui/frame";
import { ModalDialogParams, ModalDialogService } from "@nativescript/angular/directives/dialogs";

import { device, isIOS } from "@nativescript/core/platform";

import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { nsTestBedRender, nsTestBedAfterEach, nsTestBedBeforeEach, NATIVESCRIPT_TESTING_PROVIDERS, NativeScriptTestingModule } from "@nativescript/angular/testing";
import { NSLocationStrategy, Outlet } from "@nativescript/angular";
import { FrameService } from "@nativescript/angular";
import { DetachedLoader, NativeScriptModule } from "@nativescript/angular";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { NS_COMPILER_PROVIDERS } from "@nativescript/angular/platform";
import { CommonModule } from "@angular/common";

import { FakeFrameService } from "./ns-location-strategy";
const CLOSE_WAIT = isIOS ? 1000 : 0;

@Component({
    selector: "modal-comp",
    template: `<Label text="this is modal component" (shownModally)="onShownModally()"></Label>`
})
export class ModalComponent {
    constructor(public params: ModalDialogParams, private page: Page) { }

    onShownModally() {
        const result = this.params.context;
        this.params.closeCallback(result);
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
    constructor(
        public service: ModalDialogService,
        public vcRef: ViewContainerRef,
        public locationStrategy: NSLocationStrategy,
        public fakeFrameService: FrameService) {
    }
}

describe("modal-dialog", () => {

    // beforeEach(nsTestBedBeforeEach(
    //     [FailComponent, SuccessComponent],
    //     [{ provide: FrameService, useValue: new FakeFrameService() }, NSLocationStrategy],
    //     [],
    //     [ModalComponent]));
    beforeEach((done) => {
      TestBed.resetTestEnvironment();
      @NgModule({
          declarations: [FailComponent, SuccessComponent, ModalComponent],
          exports: [FailComponent, SuccessComponent, ModalComponent],
          entryComponents: [ModalComponent]
      })
      class EntryComponentsTestModule {
      }
      TestBed.initTestEnvironment(
          EntryComponentsTestModule,
          platformBrowserDynamicTesting(NS_COMPILER_PROVIDERS)
      );
      TestBed.configureTestingModule({
          declarations: [FailComponent, SuccessComponent, ModalComponent],
          imports: [
              NativeScriptModule, NativeScriptTestingModule, CommonModule,
          ],
          providers: [{ provide: FrameService, useValue: new FakeFrameService() }, NSLocationStrategy, ...NATIVESCRIPT_TESTING_PROVIDERS],
      });
      TestBed.compileComponents()
          .then(() => done())
          .catch((e) => {
              console.log(`Failed to instantiate test component with error: ${e}`);
              console.log(e.stack);
              done();
      });
    });
    afterEach(nsTestBedAfterEach());
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


    it("showModal throws when there is no viewContainer provided", async(() => {
        nsTestBedRender(FailComponent)
            .then((fixture: ComponentFixture<FailComponent>) => {
                const service = <ModalDialogService>fixture.componentRef.instance.service;
                assert.throws(() => service.showModal(ModalComponent, {}),
                    "No viewContainerRef: Make sure you pass viewContainerRef in ModalDialogOptions."
                );
            });
    }));

    it("showModal succeeds when there is viewContainer provided", (done) => {
        nsTestBedRender(SuccessComponent)
            .then((fixture: ComponentFixture<SuccessComponent>) => {
                const service = <ModalDialogService>fixture.componentRef.instance.service;
                const locStrategy = <NSLocationStrategy>fixture.componentRef.instance.locationStrategy;
                const outlet = new Outlet("primary", null, "primary", 0);

                let parentView = fixture.componentRef.instance.vcRef.element.nativeElement;
                parentView = parentView.page && parentView.page.frame;
                outlet.frames.push(parentView);
                locStrategy._getOutlets().push(outlet);

                locStrategy.pushState(null, "test", "/test", null);

                const comp = <SuccessComponent>fixture.componentRef.instance;
                return service.showModal(ModalComponent, { viewContainerRef: comp.vcRef });
            })
            .then((res) => setTimeout(done, CLOSE_WAIT)) // wait for the dialog to close in IOS
            .catch((e) => done(e));
    });

    it("showModal passes modal params and gets result when resolved", (done) => {
        const context = { property: "my context" };
        nsTestBedRender(SuccessComponent)
            .then((fixture: ComponentFixture<SuccessComponent>) => {
                const service = <ModalDialogService>fixture.componentRef.instance.service;
                const locStrategy = <NSLocationStrategy>fixture.componentRef.instance.locationStrategy;
                const outlet = new Outlet("primary", null, "primary", 0);

                let parentView = fixture.componentRef.instance.vcRef.element.nativeElement;
                parentView = parentView.page && parentView.page.frame;
                outlet.frames.push(parentView);
                locStrategy._getOutlets().push(outlet);

                locStrategy.pushState(null, "test", "/test", null);

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
