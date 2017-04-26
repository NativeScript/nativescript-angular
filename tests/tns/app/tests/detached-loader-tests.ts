// make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {TestApp} from "./test-app";
import {
    Component,
    ElementRef,
    Renderer,
    AfterViewInit,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy
} from "@angular/core";
import {ProxyViewContainer} from "ui/proxy-view-container";
import {Red} from "color/known-colors";
import {dumpView} from "./test-utils";
import {LayoutBase} from "ui/layouts/layout-base";
import {StackLayout} from "ui/layouts/stack-layout";
import {DetachedLoader} from "nativescript-angular/common/detached-loader";

@Component({
    template: `<StackLayout><Label text="COMPONENT"></Label></StackLayout>`
})
class TestComponent { }


class LoaderComponentBase {
    @ViewChild(DetachedLoader) public loader: DetachedLoader;

    public ready: Promise<LoaderComponentBase>;
    private resolve;
    constructor() {
        this.ready = new Promise((reslove, reject) => {
            this.resolve = reslove;
        });
    }
    ngAfterViewInit() {
        console.log("!!! ngAfterViewInit -> loader: " + this.loader);
        this.resolve(this);
    }
}

@Component({
    selector: "loader-component-on-push",
    template: `
    <StackLayout>
        <DetachedContainer #loader></DetachedContainer>
    </StackLayout>
  `
})
export class LoaderComponent extends LoaderComponentBase { }

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
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create([], [LoaderComponent, LoaderComponentOnPush, TestComponent]).then((app) => {
            console.log("TEST APP: " + app);
            testApp = app;
        });
    });

    after(() => {
        testApp.dispose();
    });

    afterEach(() => {
        testApp.disposeComponents();
    });

    it("creates component", (done) => {
        testApp.loadComponent(LoaderComponent)
            .then((componentRef) => {
                // wait for the ngAfterViewInit
                return (<LoaderComponent>componentRef.instance).ready;
            })
            .then((comp) => {
                // load test component with loader
                return comp.loader.loadComponent(TestComponent);
            })
            .then((compRef) => {
                done();
            })
            .catch(done);
    });


    it("creates component when ChangeDetectionStrategy is OnPush", (done) => {
        testApp.loadComponent(LoaderComponentOnPush)
            .then((componentRef) => {
                // wait for the ngAfterViewInit
                return (<LoaderComponentOnPush>componentRef.instance).ready;
            })
            .then((comp) => {
                // load test component with loader
                return comp.loader.loadComponent(TestComponent);
            })
            .then((compRef) => {
                done();
            })
            .catch(done);
    });
});
