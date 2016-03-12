//make sure you import mocha-config before angular2/core
import {bootstrap} from "../nativescript-angular/application";
import {
    Type,
    Component,
    ComponentRef,
    DynamicComponentLoader,
    ViewChild,
    ElementRef,
    provide,
    ApplicationRef
} from "angular2/core";

import {View} from "ui/core/view";
import {StackLayout} from "ui/layouts/stack-layout";
import {GridLayout} from "ui/layouts/grid-layout";
import {LayoutBase} from "ui/layouts/layout-base";
import {topmost} from 'ui/frame';
import {APP_ROOT_VIEW} from "../nativescript-angular/platform-providers";

@Component({
    selector: 'my-app',
    template: `<StackLayout #loadSite></StackLayout>`
})
export class TestApp {
    @ViewChild("loadSite") public loadSiteRef: ElementRef;
    private _pageRoot: LayoutBase;
    private _appRoot: StackLayout;
    private _pendingDispose: ComponentRef[] = [];

    constructor(public loader: DynamicComponentLoader,
        public elementRef: ElementRef,
        public appRef: ApplicationRef) {
    }

    public loadComponent(type: Type): Promise<ComponentRef> {
        return this.loader.loadIntoLocation(type, this.elementRef, "loadSite").then((componentRef) => {
            this._pendingDispose.push(componentRef);
            this.appRef.tick();
            return componentRef;
        });
    }

    public disposeComponenets() {
        while (this._pendingDispose.length > 0) {
            const componentRef = this._pendingDispose.pop()
            componentRef.dispose();
        }
    }

    public static create(): Promise<TestApp> {
        const page = topmost().currentPage;
        const rootLayout = <LayoutBase>page.content;
        const viewRoot = new StackLayout();
        rootLayout.addChild(viewRoot);
        GridLayout.setRow(rootLayout, 50);
        const rootViewProvider = provide(APP_ROOT_VIEW, { useFactory: () => viewRoot });
        return bootstrap(TestApp, [rootViewProvider]).then((componentRef) => {
            const testApp = <TestApp>componentRef.instance;
            testApp._pageRoot = rootLayout;
            testApp._appRoot = viewRoot;
            return testApp;
        });
    }

    public dispose() {
        if (!this._appRoot) {
            throw new Error("Test app already disposed or not initalized.");
        }
        this.disposeComponenets();
        this._pageRoot.removeChild(this._appRoot);
        this._appRoot = null;
        this._pageRoot = null;
    }
}