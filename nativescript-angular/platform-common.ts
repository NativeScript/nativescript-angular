// Initial imports and polyfills
import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";
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

import { bootstrapLog, bootstrapLogError, isLogEnabled } from "./trace";
import { defaultPageFactoryProvider, setRootPage, PageFactory, PAGE_FACTORY } from "./platform-providers";
import { AppHostView } from "./app-host-view";

import {
    setCssFileName,
    run as applicationRun,
    _resetRootView as applicationRerun,
    on,
    launchEvent,
    LaunchEventData,
} from "tns-core-modules/application";
import { TextView } from "tns-core-modules/ui/text-view";

import "nativescript-intl";
import { Color, View } from "tns-core-modules/ui/core/view/view";
import { Frame } from "tns-core-modules/ui/frame";

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

// tslint:disable:max-line-length
/**
 * Options to be passed when HMR is enabled
 */
export interface HmrOptions {
    /**
     * A factory function that returns either Module type or NgModuleFactory type.
     * This needs to be a factory function as the types will change when modules are replaced.
     */
    moduleTypeFactory?: () => Type<any> | NgModuleFactory<any>;

    /**
     * A livesync callback that will be called instead of the original livesync.
     * It gives the HMR a hook to apply the module replacement.
     * @param bootstrapPlatform - A bootstrap callback to be called after HMR is done. It will bootstrap a new angular app within the exisiting platform, using the moduleTypeFactory to get the Module or NgModuleFactory to be used.
     */
    livesyncCallback: (bootstrapPlatform: () => void) => void;
}
// tslint:enable:max-line-length


export interface AppOptions {
    bootInExistingPage?: boolean;
    cssFile?: string;
    startPageActionBarHidden?: boolean;
    createFrameOnBootstrap?: boolean;
    hmrOptions?: HmrOptions;
}

export type PlatformFactory = (extraProviders?: StaticProvider[]) => PlatformRef;

export class NativeScriptSanitizer extends Sanitizer {
    sanitize(_context: any, value: string): string {
        return value;
    }
}

export class NativeScriptDocument {
    // Required by the AnimationDriver
    public body: any = {
        isOverride: true,
    };

    createElement(tag: string) {
        throw new Error("NativeScriptDocument is not DOM Document. There is no createElement() method.");
    }
}

export const COMMON_PROVIDERS = [
    defaultPageFactoryProvider,
    { provide: Sanitizer, useClass: NativeScriptSanitizer, deps: [] },
    { provide: DOCUMENT, useClass: NativeScriptDocument, deps: [] },
];

export class NativeScriptPlatformRef extends PlatformRef {
    private _bootstrapper: BootstrapperAction;

    constructor(private platform: PlatformRef, private appOptions: AppOptions = {}) {
        super();
    }

    @profile
    bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>> {
        this._bootstrapper = () => {
            let bootstrapFactory = moduleFactory;
            if (this.appOptions.hmrOptions) {
                bootstrapFactory = <NgModuleFactory<M>>this.appOptions.hmrOptions.moduleTypeFactory();
            }

            return this.platform.bootstrapModuleFactory(bootstrapFactory);
        };

        this.bootstrapApp();

        return null; // Make the compiler happy
    }

    @profile
    bootstrapModule<M>(
        moduleType: Type<M>,
        compilerOptions: CompilerOptions | CompilerOptions[] = []
    ): Promise<NgModuleRef<M>> {
        this._bootstrapper = () => {
            let bootstrapType = moduleType;
            if (this.appOptions.hmrOptions) {
                bootstrapType = <Type<M>>this.appOptions.hmrOptions.moduleTypeFactory();
            }

            return this.platform.bootstrapModule(bootstrapType, compilerOptions);
        };
        this.bootstrapApp();

        return null; // Make the compiler happy
    }

    @profile
    private bootstrapApp() {
        (<any>global).__onLiveSyncCore = () => {
            if (this.appOptions.hmrOptions) {
                this.appOptions.hmrOptions.livesyncCallback(() => this._livesync());
            } else {
                this._livesync();
            }
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
        const autoCreateFrame = !!this.appOptions.createFrameOnBootstrap;
        let tempAppHostView: AppHostView;
        let rootContent: View;

        if (autoCreateFrame) {
            const { page, frame } = this.createFrameAndPage(false);
            setRootPage(page);
            rootContent = frame;
        } else {
            // Create a temp page for root of the renderer
            tempAppHostView = new AppHostView();
            setRootPage(<any>tempAppHostView);
        }

        if (isLogEnabled()) {
            bootstrapLog("NativeScriptPlatform bootstrap started.");
        }
        const launchCallback = profile(
            "nativescript-angular/platform-common.launchCallback",
            (args: LaunchEventData) => {
                if (isLogEnabled()) {
                    bootstrapLog("Application launch event fired");
                }

                let bootstrapPromiseCompleted = false;
                this._bootstrapper().then(
                    moduleRef => {
                        bootstrapPromiseCompleted = true;

                        if (isLogEnabled()) {
                            bootstrapLog(`Angular bootstrap bootstrap done. uptime: ${uptime()}`);
                        }

                        if (!autoCreateFrame) {
                            rootContent = tempAppHostView.content;
                        }

                        lastBootstrappedModule = new WeakRef(moduleRef);
                    },
                    err => {
                        bootstrapPromiseCompleted = true;

                        const errorMessage = err.message + "\n\n" + err.stack;
                        if (isLogEnabled()) {
                            bootstrapLogError("ERROR BOOTSTRAPPING ANGULAR");
                        }
                        if (isLogEnabled()) {
                            bootstrapLogError(errorMessage);
                        }

                        rootContent = this.createErrorUI(errorMessage);
                    }
                );

                if (isLogEnabled()) {
                    bootstrapLog("bootstrapAction called, draining micro tasks queue. Root: " + rootContent);
                }
                (<any>global).Zone.drainMicroTaskQueue();
                if (isLogEnabled()) {
                    bootstrapLog("bootstrapAction called, draining micro tasks queue finished! Root: " + rootContent);
                }

                if (!bootstrapPromiseCompleted) {
                    const errorMessage = "Bootstrap promise didn't resolve";
                    if (isLogEnabled()) {
                        bootstrapLogError(errorMessage);
                    }
                    rootContent = this.createErrorUI(errorMessage);
                }

                args.root = rootContent;
            }
        );
        on(launchEvent, launchCallback);

        applicationRun();
    }

    @profile
    public _livesync() {
        if (isLogEnabled()) {
            bootstrapLog("Angular livesync started.");
        }

        const lastModuleRef = lastBootstrappedModule ? lastBootstrappedModule.get() : null;
        onBeforeLivesync.next(lastModuleRef);
        if (lastModuleRef) {
            lastModuleRef.destroy();
        }

        const autoCreateFrame = !!this.appOptions.createFrameOnBootstrap;
        let tempAppHostView: AppHostView;
        let rootContent: View;

        if (autoCreateFrame) {
            const { page, frame } = this.createFrameAndPage(true);
            setRootPage(page);
            rootContent = frame;
        } else {
            // Create a temp page for root of the renderer
            tempAppHostView = new AppHostView();
            setRootPage(<any>tempAppHostView);
        }

        let bootstrapPromiseCompleted = false;
        this._bootstrapper().then(
            moduleRef => {
                bootstrapPromiseCompleted = true;
                if (isLogEnabled()) {
                    bootstrapLog("Angular livesync done.");
                }
                onAfterLivesync.next({ moduleRef });

                if (!autoCreateFrame) {
                    rootContent = tempAppHostView.content;
                }

                lastBootstrappedModule = new WeakRef(moduleRef);
            },
            error => {
                bootstrapPromiseCompleted = true;
                if (isLogEnabled()) {
                    bootstrapLogError("ERROR LIVESYNC BOOTSTRAPPING ANGULAR");
                }
                const errorMessage = error.message + "\n\n" + error.stack;
                if (isLogEnabled()) {
                    bootstrapLogError(errorMessage);
                }

                rootContent = this.createErrorUI(errorMessage);

                onAfterLivesync.next({ error });
            }
        );

        if (isLogEnabled()) {
            bootstrapLog("livesync bootstrapAction called, draining micro tasks queue. Root: " + rootContent);
        }
        (<any>global).Zone.drainMicroTaskQueue();
        if (isLogEnabled()) {
            bootstrapLog("livesync bootstrapAction called, draining micro tasks queue finished! Root: " + rootContent);
        }

        if (!bootstrapPromiseCompleted) {
            const result = "Livesync bootstrap promise didn't resolve";
            if (isLogEnabled()) {
                bootstrapLogError(result);
            }
            rootContent = this.createErrorUI(result);

            onAfterLivesync.next({ error: new Error(result) });
        }

        applicationRerun({
            create: () => rootContent,
        });
    }

    private createErrorUI(message: string): View {
        const errorTextBox = new TextView();
        errorTextBox.text = message;
        errorTextBox.color = new Color("red");
        return errorTextBox;
    }

    private createFrameAndPage(isLivesync: boolean) {
        const frame = new Frame();
        const pageFactory: PageFactory = this.platform.injector.get(PAGE_FACTORY);
        const page = pageFactory({ isBootstrap: true, isLivesync });

        frame.navigate({ create: () => { return page; } });
        return { page, frame };
    }
}
