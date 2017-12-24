// make sure you import mocha-config before @angular/core
import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { DetachedLoader } from "nativescript-angular";
import { nTestBedAfterEach, nTestBedBeforeEach, nTestBedRender } from "nativescript-angular/testing";

@Component({
    template: `<StackLayout><Label text="COMPONENT"></Label></StackLayout>`
})
class TestComponent { }


class LoaderComponentBase {
    @ViewChild(DetachedLoader) public loader: DetachedLoader;
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

describe("DetachedLoader", () => {

    beforeEach(nTestBedBeforeEach([LoaderComponent, LoaderComponentOnPush], [], [], [TestComponent]));
    afterEach(nTestBedAfterEach());

    it("creates component", () => {
        return nTestBedRender(LoaderComponent).then((fixture) => {
            const component: LoaderComponent = fixture.componentRef.instance;
            return component.loader.loadComponent(TestComponent);
        });
    });


    it("creates component when ChangeDetectionStrategy is OnPush", () => {
        return nTestBedRender(LoaderComponentOnPush).then((fixture) => {
            const component: LoaderComponentOnPush = fixture.componentRef.instance;
            return component.loader.loadComponent(TestComponent);
        });
    });
});
