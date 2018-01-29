// Initial imports and polyfills
import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";
import "reflect-metadata";
import "./polyfills/array";
import "./polyfills/console";
import { profile, uptime } from "tns-core-modules/profiling";

import {
    Type,
    Injector,
    CompilerOptions,
    PlatformRef,
    NgModuleFactory,
    NgModuleRef,
    EventEmitter,
    Sanitizer,
    InjectionToken,
    StaticProvider,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { bootstrapLog, bootstrapLogError } from "./trace";
import { PAGE_FACTORY, PageFactory, defaultPageFactoryProvider, setRootPage } from "./platform-providers";

import {
    setCssFileName,
    run as applicationRun,
    on,
    off,
    launchEvent,
    LaunchEventData,
    ios as iosApp,
} from "tns-core-modules/application";
import { NavigationEntry } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { ContentView } from "tns-core-modules/ui/content-view";
import { TextView } from "tns-core-modules/ui/text-view";

import "nativescript-intl";
import { View, Color } from "tns-core-modules/ui/core/view/view";

export const onBeforeLivesync = new EventEmitter<NgModuleRef<any>>();
export const onAfterLivesync = new EventEmitter<{ moduleRef?: NgModuleRef<any>; error?: Error }>();
let lastBootstrappedModule: WeakRef<NgModuleRef<any>>;
type BootstrapperAction = () => Promise<NgModuleRef<any>>;

// Work around a TS bug requiring an import of OpaqueToken without using it
if ((<any>global).___TS_UNUSED) {
    (() => {
        return InjectionToken;
    })();
}
export interface AppOptions {
    bootInExistingPage?: boolean;
    cssFile?: string;
    startPageActionBarHidden?: boolean;
}

export type PlatformFactory = (extraProviders?: StaticProvider[]) => PlatformRef;

export class NativeScriptSanitizer extends Sanitizer {
    sanitize(_context: any, value: string): string {
        return value;
    }
}

// Add a fake polyfill for the document object
(<any>global).document = (<any>global).document || {};
const doc = (<any>global).document;
doc.body = Object.assign(doc.body || {}, {
    isOverride: true,
});

export class NativeScriptDocument {
    createElement(tag: string) {
        throw new Error("NativeScriptDocument is not DOM Document. There is no createElement() method.");
    }
}

export const COMMON_PROVIDERS = [
    defaultPageFactoryProvider,
    { provide: Sanitizer, useClass: NativeScriptSanitizer, deps: [] },
    { provide: DOCUMENT, useValue: doc },
];

export class NativeScriptPlatformRef extends PlatformRef {
    private _bootstrapper: BootstrapperAction;

    constructor(private platform: PlatformRef, private appOptions: AppOptions = {}) {
        super();
    }

    @profile
    bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>> {
        this._bootstrapper = () => this.platform.bootstrapModuleFactory(moduleFactory);

        this.bootstrapApp();

        return null; // Make the compiler happy
    }

    @profile
    bootstrapModule<M>(
        moduleType: Type<M>,
        compilerOptions: CompilerOptions | CompilerOptions[] = []
    ): Promise<NgModuleRef<M>> {
        this._bootstrapper = () => this.platform.bootstrapModule(moduleType, compilerOptions);

        this.bootstrapApp();

        return null; // Make the compiler happy
    }

    @profile
    private bootstrapApp() {
        (<any>global).__onLiveSyncCore = () => {
            this.livesync();
        };

        if (this.appOptions && typeof this.appOptions.cssFile === "string") {
            setCssFileName(this.appOptions.cssFile);
        }

        this.bootstrapNativeScriptApp();
    }

    onDestroy(callback: () => void): void {
        this.platform.onDestroy(callback);
    }

    get injector(): Injector {
        return this.platform.injector;
    }

    destroy(): void {
        this.platform.destroy();
    }

    get destroyed(): boolean {
        return this.platform.destroyed;
    }

    @profile
    private bootstrapNativeScriptApp() {
        // Create a temp page for root of the renderer
        const tempRootView = new RootView();
        setRootPage(<any>tempRootView);
        let rootContent: View;

        bootstrapLog("NativeScriptPlatform bootstrap started.");
        const launchCallback = profile(
            "nativescript-angular/platform-common.launchCallback",
            (args: LaunchEventData) => {
                bootstrapLog("Application launch event fired");
                off(launchEvent, launchCallback);

                let bootstrapPromiseCompleted = false;
                this._bootstrapper().then(
                    moduleRef => {
                        bootstrapPromiseCompleted = true;

                        bootstrapLog(`Angular bootstrap bootstrap done. uptime: ${uptime()}`);
                        rootContent = tempRootView.content;
                        tempRootView.content = null;
                        rootContent.parentNode = tempRootView;
                        lastBootstrappedModule = new WeakRef(moduleRef);
                    },
                    err => {
                        bootstrapPromiseCompleted = true;

                        const errorMessage = err.message + "\n\n" + err.stack;
                        bootstrapLogError("ERROR BOOTSTRAPPING ANGULAR");
                        bootstrapLogError(errorMessage);

                        rootContent = this.createErrorUI(errorMessage);
                    }
                );

                bootstrapLog("bootstrapAction called, draining micro tasks queue. Root: " + rootContent);
                (<any>global).Zone.drainMicroTaskQueue();
                bootstrapLog("bootstrapAction called, draining micro tasks queue finished! Root: " + rootContent);

                if (!bootstrapPromiseCompleted) {
                    const errorMessage = "Bootstrap promise didn't resolve";
                    bootstrapLogError(errorMessage);
                    rootContent = this.createErrorUI(errorMessage);
                }

                args.root = rootContent;
            }
        );
        on(launchEvent, launchCallback);

        applicationRun();
    }

    @profile
    private livesync() {
        bootstrapLog("Angular livesync started.");

        onBeforeLivesync.next(lastBootstrappedModule ? lastBootstrappedModule.get() : null);

        const tempRootView = new RootView();
        setRootPage(<any>tempRootView);
        let rootContent: View;

        let bootstrapPromiseCompleted = false;
        this._bootstrapper().then(
            moduleRef => {
                bootstrapPromiseCompleted = true;
                bootstrapLog("Angular livesync done.");
                onAfterLivesync.next({ moduleRef });

                rootContent = tempRootView.content;
                tempRootView.content = null;
                rootContent.parentNode = tempRootView;
                lastBootstrappedModule = new WeakRef(moduleRef);
            },
            error => {
                bootstrapPromiseCompleted = true;
                bootstrapLogError("ERROR LIVESYNC BOOTSTRAPPING ANGULAR");
                const errorMessage = error.message + "\n\n" + error.stack;
                bootstrapLogError(errorMessage);

                rootContent = this.createErrorUI(errorMessage);

                onAfterLivesync.next({ error });
            }
        );

        bootstrapLog("livesync bootstrapAction called, draining micro tasks queue. Root: " + rootContent);
        (<any>global).Zone.drainMicroTaskQueue();
        bootstrapLog("livesync bootstrapAction called, draining micro tasks queue finished! Root: " + rootContent);

        if (!bootstrapPromiseCompleted) {
            const errorMessage = "Livesync bootstrap promise didn't resolve";
            bootstrapLogError(errorMessage);
            rootContent = this.createErrorUI(errorMessage);

            onAfterLivesync.next({ error: new Error(errorMessage) });
        }

        // TODO: use application._resetRootView method
        if (iosApp) {
            (<any>iosApp).setWindowContent(rootContent);
        }
    }

    private createErrorUI(message: string): View {
        const errorTextBox = new TextView();
        errorTextBox.text = message;
        errorTextBox.color = new Color("red");
        return errorTextBox;
    }
}

class RootView extends ContentView {}
