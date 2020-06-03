// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { Component, ElementRef } from "@angular/core";
import { dumpView, createDevice } from "./test-utils";
import { DEVICE } from "@nativescript/angular/platform-providers";
import { platformNames } from "@nativescript/core/platform";
import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender } from "@nativescript/angular/testing";

@Component({
    template: `
    <StackLayout>
        <ios><Label text="IOS"></Label></ios>
    </StackLayout>`
})
export class IosSpecificComponent {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    template: `
    <StackLayout>
        <android><Label text="ANDROID"></Label></android>
    </StackLayout>`
})
export class AndroidSpecificComponent {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    template: `
    <StackLayout>
        <Label android:text="ANDROID" ios:text="IOS"></Label>
    </StackLayout>`
})
export class PlatformSpecificAttributeComponent {
    constructor(public elementRef: ElementRef) { }
}

describe("Platform filter directives", () => {
    describe("on IOS device", () => {
        beforeEach(nsTestBedBeforeEach(
            [PlatformSpecificAttributeComponent, AndroidSpecificComponent, IosSpecificComponent],
            [{provide: DEVICE, useValue: createDevice(platformNames.ios)}]
        ));
        afterEach(nsTestBedAfterEach());
        it("does render ios specific content", () => {
            return nsTestBedRender(IosSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("(label[text=IOS])") >= 0);
            });
        });
        it("does not render android specific content", () => {
            return nsTestBedRender(AndroidSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("Label") < 0);
            });
        });
        it("applies iOS specific attribute", () => {
            return nsTestBedRender(PlatformSpecificAttributeComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(proxyviewcontainer (stacklayout (label[text=IOS])))",
                    dumpView(componentRoot, true));
            });
        });
    });

    describe("on Android device", () => {
        beforeEach(nsTestBedBeforeEach(
            [PlatformSpecificAttributeComponent, AndroidSpecificComponent, IosSpecificComponent],
            [{provide: DEVICE, useValue: createDevice(platformNames.android)}]
        ));
        afterEach(nsTestBedAfterEach());

        it("does render android specific content", () => {
            return nsTestBedRender(AndroidSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("(label[text=ANDROID])") >= 0);
            });
        });
        it("does not render ios specific content", () => {
            return nsTestBedRender(IosSpecificComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.isTrue(dumpView(componentRoot, true).indexOf("Label") < 0);
            });
        });
        it("applies Android specific attribute", () => {
            return nsTestBedRender(PlatformSpecificAttributeComponent).then((fixture) => {
                const componentRef = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(proxyviewcontainer (stacklayout (label[text=ANDROID])))",
                    dumpView(componentRoot, true));
            });
        });
    });
});
