//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {Component, ElementRef} from "@angular/core";
import {ProxyViewContainer} from "ui/proxy-view-container";
import {dumpView, createDevice} from "./test-utils";
import {TestApp} from "./test-app";
import {DEVICE} from "nativescript-angular/platform-providers";
import {platformNames} from "platform";

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

describe('Platofrm filter directives', () => {
    describe('on IOS device', () => {
        let testApp: TestApp = null;

        before(() => {
            return TestApp.create([{provide: DEVICE, useValue: createDevice(platformNames.ios)}], [PlatformSpecificAttributeComponent, AndroidSpecificComponent, IosSpecificComponent]).then((app) => {
                testApp = app;
            });
        });

        after(() => {
            testApp.dispose();
        });

        it("does render ios sepecific conternt", () => {
            return testApp.loadComponent(IosSpecificComponent).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (ProxyViewContainer (template), (Label[text=IOS]))))",
                    dumpView(componentRoot, true));
            });
        });

        it("does not render android sepecific conternt", () => {
            return testApp.loadComponent(AndroidSpecificComponent).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (ProxyViewContainer (template))))",
                    dumpView(componentRoot, true));
            });
        });


        it("applies iOS specific attribute", () => {
            return testApp.loadComponent(PlatformSpecificAttributeComponent).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (Label[text=IOS])))",
                    dumpView(componentRoot, true));
            });
        });
    });

    describe('on Android device', () => {
        let testApp: TestApp = null;

        before(() => {
            return TestApp.create([{provide: DEVICE, useValue: createDevice(platformNames.android)}], [AndroidSpecificComponent, IosSpecificComponent, PlatformSpecificAttributeComponent]).then((app) => {
                testApp = app;
            });
        });

        after(() => {
            testApp.dispose();
        });

        it("does render android sepecific conternt", () => {
            return testApp.loadComponent(AndroidSpecificComponent).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (ProxyViewContainer (template), (Label[text=ANDROID]))))",
                    dumpView(componentRoot, true));
            });
        });

        it("does not render ios sepecific conternt", () => {
            return testApp.loadComponent(IosSpecificComponent).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (ProxyViewContainer (template))))",
                    dumpView(componentRoot, true));
            });
        });

        it("applies Android specific attribute", () => {
            return testApp.loadComponent(PlatformSpecificAttributeComponent).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (StackLayout (Label[text=ANDROID])))",
                    dumpView(componentRoot, true));
            });
        });
    });
});
