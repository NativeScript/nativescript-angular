import { NativeScriptModule, platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import {
    Type, Component, ComponentRef, DynamicComponentLoader,
    ViewChild, ElementRef, provide, ApplicationRef, Renderer,
    ViewContainerRef, NgZone, NgModule, NgModuleRef
} from "@angular/core";

import {GridLayout} from "ui/layouts/grid-layout";
import {LayoutBase} from "ui/layouts/layout-base";
import {topmost} from 'ui/frame';
import {APP_ROOT_VIEW} from "nativescript-angular/platform-providers";

@Component({
    selector: 'my-app',
    template: `<StackLayout #loadSite></StackLayout>`
})
export class TestApp {
    @ViewChild("loadSite") public loadSiteRef: ElementRef;
    private _pendingDispose: ComponentRef<any>[] = [];

    constructor(public loader: DynamicComponentLoader,
        public elementRef: ViewContainerRef,
        public appRef: ApplicationRef,
        public renderer: Renderer,
        public zone: NgZone) {

        registerTestApp(TestApp, this, appRef);
    }

    public loadComponent(type: Type): Promise<ComponentRef<any>> {
        return this.loader.loadNextToLocation(type, this.elementRef).then((componentRef) => {
            this._pendingDispose.push(componentRef);
            this.appRef.tick();
            return componentRef;
        });
    }

    public disposeComponents() {
        while (this._pendingDispose.length > 0) {
            const componentRef = this._pendingDispose.pop()
            componentRef.destroy();
        }
    }

    public static create(providers?: any[]): Promise<TestApp> {
        return bootstrapTestApp(TestApp, providers);
    }

    public dispose() {
        this.disposeComponents();
        destroyTestApp(this);
    }
}

const runningApps = new Map<any, { container: LayoutBase, appRoot: GridLayout, appRef: ApplicationRef }>();
const platform = platformNativeScriptDynamic({bootInExistingPage: true});

export function registerTestApp(appType, appInstance, appRef) {
    appType.moduleType.appInstance = appInstance;
    runningApps.set(appInstance, {
        container: appType.moduleType.container,
        appRoot: appType.moduleType.viewRoot,
        appRef: appRef,
    });
}

export function bootstrapTestApp<T>(appComponentType: new (...args) => T, providers: any[] = [], routes: any[] = []): Promise<T> {
    const page = topmost().currentPage;
    const rootLayout = <LayoutBase>page.content;
    const viewRoot = new GridLayout();
    rootLayout.addChild(viewRoot);
    (<any>viewRoot.style).backgroundColor = "white";
    viewRoot.margin = "20";
    viewRoot.opacity = 0.7;
    GridLayout.setRowSpan(rootLayout, 50);
    GridLayout.setColumnSpan(rootLayout, 50);

    let imports: any[] = [
        NativeScriptModule,
        NativeScriptRouterModule,
    ];
    if (routes && routes.length > 0) {
        imports.push(NativeScriptRouterModule.forRoot(routes));
    }

    const rootViewProvider = provide(APP_ROOT_VIEW, { useValue: viewRoot });

    @NgModule({
        bootstrap: [
            appComponentType
        ],
        declarations: [
            appComponentType
        ],
        imports: imports,
        exports: [
            NativeScriptModule,
        ],
        providers: [
            rootViewProvider,
            ...providers,
        ]
    })
    class TestAppModule {
        public static viewRoot = viewRoot;
        public static container = rootLayout;
    }
    //app registers with the module type via static fields on start
    (<any>appComponentType).moduleType = TestAppModule;

    return platform.bootstrapModule(TestAppModule).then(moduleRef => {
        //app component constructor has run and we should have a
        //registered component instance.
        return (<any>TestAppModule).appInstance;
    });
}

export function destroyTestApp(app: any) {
    if (!runningApps.has(app)) {
        throw new Error("Unable to cleanup app: " + app);
    }

    var entry = runningApps.get(app);
    entry.container.removeChild(entry.appRoot);
    entry.appRef.dispose();
    runningApps.delete(app);
}
