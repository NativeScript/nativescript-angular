//make sure you import mocha-config before angular2/core
import {bootstrap, ProviderArray} from "../nativescript-angular/application";
import {Type, Component, ComponentRef, DynamicComponentLoader,
    ViewChild, ElementRef, provide, ApplicationRef
} from "angular2/core";

import {View} from "ui/core/view";
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
        return bootstrapTestApp(TestApp);
    }

    public dispose() {
        this.disposeComponenets();
        destroyTestApp(this);
    }
}

var runningApps = new Map<any, { hostView: LayoutBase, appRoot: GridLayout, appRef: ApplicationRef }>();

export function bootstrapTestApp(appComponentType: any, providers: ProviderArray = []): Promise<any> {
    const page = topmost().currentPage;
    const rootLayout = <LayoutBase>page.content;
    const viewRoot = new GridLayout();
    rootLayout.addChild(viewRoot);
    (<any>viewRoot.style).backgroundColor = "white";
    viewRoot.margin = "20";
    viewRoot.opacity = 0.7;
    GridLayout.setRowSpan(rootLayout, 50);
    GridLayout.setColumnSpan(rootLayout, 50);
    
    const rootViewProvider = provide(APP_ROOT_VIEW, { useValue: viewRoot });
    return bootstrap(appComponentType, providers.concat(rootViewProvider)).then((componentRef) => {
        componentRef.injector.get(ApplicationRef)
        const testApp = componentRef.instance;
        
        runningApps.set(testApp, { 
            hostView: rootLayout, 
            appRoot: viewRoot, 
            appRef: componentRef.injector.get(ApplicationRef) });
            
        return testApp;
    });
}

export function destroyTestApp(app: any) {
    if (!runningApps.has(app)) {
        throw new Error("Unable to cleanup app: " + app);
    }

    var entry = runningApps.get(app);
    entry.hostView.removeChild(entry.appRoot);
    entry.appRef.dispose();
    runningApps.delete(app);
}
