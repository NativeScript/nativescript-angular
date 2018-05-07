import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import {
    Type, Component, ComponentRef,
    ComponentFactoryResolver, ApplicationRef, Renderer2,
    ViewContainerRef, NgZone, NgModule, ErrorHandler,
} from "@angular/core";

import { getRootView } from "tns-core-modules/application";
import { Frame } from "tns-core-modules/ui/frame";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";

import { APP_ROOT_VIEW } from "nativescript-angular/platform-providers";

@Component({
    selector: "my-app",
    template: `<StackLayout #loadSite></StackLayout>`
})
export class TestApp {
    private _pendingDispose: ComponentRef<any>[] = [];

    constructor(
            private resolver: ComponentFactoryResolver,
            private containerRef: ViewContainerRef,
            public appRef: ApplicationRef,
            public renderer: Renderer2,
            public zone: NgZone
        ) {

        registerTestApp(TestApp, this, appRef);
    }

    public loadComponent<T>(componentType: Type<T>): Promise<ComponentRef<T>> {
        const factory = this.resolver.resolveComponentFactory(componentType);
        const componentRef = this.containerRef.createComponent(
            factory, this.containerRef.length, this.containerRef.parentInjector);
        this._pendingDispose.push(componentRef);

        this.appRef.tick();
        return Promise.resolve(componentRef);
    }

    public disposeComponents() {
        while (this._pendingDispose.length > 0) {
            const componentRef = this._pendingDispose.pop();
            componentRef.destroy();
        }
    }

    public static create(providers?: any[], components: any[] = [], directives: any[] = []): Promise<TestApp> {
        return bootstrapTestApp(TestApp, providers, [], components, directives);
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

class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("### ErrorHandler Error: " + error.toString());
        console.log("### ErrorHandler Stack: " + error.stack);
    }
}

export function bootstrapTestApp<T>(
    appComponentType: new (...args) => T,
    providers: any[] = [],
    routes: any[] = [],
    components: any[] = [],
    directives: any[] = []
): Promise<T> {
    const page = (<Frame>getRootView()).currentPage;
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

    const rootViewProvider = {provide: APP_ROOT_VIEW, useValue: viewRoot};

    @NgModule({
        bootstrap: [
            appComponentType
        ],
        declarations: [
            appComponentType,
            ...components,
            ...directives,
        ],
        entryComponents: [
            ...components,
        ],
        imports: imports,
        exports: [
            NativeScriptModule,
            ...components,
            ...directives,
        ],
        providers: [
            rootViewProvider,
            { provide: ErrorHandler, useClass: MyErrorHandler },
            ...providers,
        ]
    })
    class TestAppModule {
        public static viewRoot = viewRoot;
        public static container = rootLayout;
    }
    // app registers with the module type via static fields on start
    (<any>appComponentType).moduleType = TestAppModule;

    return platform.bootstrapModule(TestAppModule).then(moduleRef => {
        // app component constructor has run and we should have a
        // registered component instance.
        return (<any>TestAppModule).appInstance;
    });
}

export function destroyTestApp(app: any) {
    if (!runningApps.has(app)) {
        throw new Error("Unable to cleanup app: " + app);
    }

    const entry = runningApps.get(app);
    entry.container.removeChild(entry.appRoot);
    // TODO: App disposal not doing anything useful anymore. Get rid of it?
    // entry.appRef.dispose();
    runningApps.delete(app);
}
