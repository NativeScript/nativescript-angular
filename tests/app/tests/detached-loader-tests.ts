// make sure you import mocha-config before @angular/core
import { NgModule, ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetachedLoader, NativeScriptModule } from "@nativescript/angular";
import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender, NATIVESCRIPT_TESTING_PROVIDERS, NativeScriptTestingModule } from "@nativescript/angular/testing";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
// import { NS_COMPILER_PROVIDERS } from "@nativescript/angular/platform";
import { CommonModule } from "@angular/common";

@Component({
    template: `<StackLayout><Label text="COMPONENT"></Label></StackLayout>`
})
class TestComponent { }


class LoaderComponentBase {
    @ViewChild(DetachedLoader, { static: false }) public loader: DetachedLoader;
}

@Component({
    selector: "loader-component-on-push",
    template: `
    <StackLayout>
        <DetachedContainer #loader></DetachedContainer>
    </StackLayout>
    `
})
export class LoaderComponent extends LoaderComponentBase {}

@Component({
    selector: "loader-component-on-push",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <StackLayout>
        <DetachedContainer #loader></DetachedContainer>
    </StackLayout>
    `
})
export class LoaderComponentOnPush extends LoaderComponentBase { }
describe("DetachedLoader", function() {
    this.timeout(4000);
    // beforeEach(nsTestBedBeforeEach([LoaderComponent, LoaderComponentOnPush], [], [], [TestComponent]));
    beforeEach((done) => {
          TestBed.resetTestEnvironment();
          @NgModule({
              declarations: [LoaderComponent, LoaderComponentOnPush, TestComponent],
              exports: [LoaderComponent, LoaderComponentOnPush, TestComponent],
              entryComponents: [TestComponent]
          })
          class EntryComponentsTestModule {
          }
          TestBed.initTestEnvironment(
              EntryComponentsTestModule,
              platformBrowserDynamicTesting()//NS_COMPILER_PROVIDERS)
          );
          TestBed.configureTestingModule({
              declarations: [LoaderComponent, LoaderComponentOnPush, TestComponent],
              imports: [
                  NativeScriptModule, NativeScriptTestingModule, CommonModule,
              ],
              providers: [...NATIVESCRIPT_TESTING_PROVIDERS],
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

    it("creates component", () => {
        return nsTestBedRender(LoaderComponent).then((fixture) => {
            const component: LoaderComponent = fixture.componentRef.instance;
            return component.loader.loadComponent(TestComponent);
        });
    });


    it("creates component when ChangeDetectionStrategy is OnPush", function() {
        return nsTestBedRender(LoaderComponentOnPush).then((fixture) => {
            const component: LoaderComponentOnPush = fixture.componentRef.instance;
            return component.loader.loadComponent(TestComponent);
        });
    });
});
