// Initial imports and polyfills
import "@nativescript/core/globals";
// Require application early to work around a circular import
import "@nativescript/core/application";
import "./zone-js/dist/zone-nativescript";
// TODO: migrate to standard zone.js if possible
// investigate Ivy with templated-items-comp to allow standard zone below to be used instead of patched {N} zone above
// import 'zone.js/dist/zone';
import "./polyfills/array";
import "./polyfills/console";
import { profile, uptime } from "@nativescript/core/profiling";
import { getRootView } from "@nativescript/core/application";
import "./dom-adapter";
import "nativescript-intl";
// TODO: refactor core module imports to not require these deep imports
import { TextView } from "@nativescript/core/ui/text-view";
import { Color, View } from "@nativescript/core/ui/core/view";
import { Frame } from "@nativescript/core/ui/frame";
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';

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
import { defaultPageFactoryProvider, setRootPage, PageFactory, PAGE_FACTORY, getRootPage } from "./platform-providers";

import {
    setCssFileName,
    run as applicationRun,
    _resetRootView as applicationRerun,
    on,
    launchEvent,
    LaunchEventData,
    exitEvent,
    ApplicationEventData,
} from "@nativescript/core/application";

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

export interface AppLaunchView extends View {
  startAnimation?: () => void;
  cleanup?: () => void;
}

export interface AppOptions {
    bootInExistingPage?: boolean;
    cssFile?: string;
    startPageActionBarHidden?: boolean;
    hmrOptions?: HmrOptions;
    backgroundColor?: string;
    launchView?: AppLaunchView;
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
                const rootView = getRootView();
                if (rootView) {
                    rootView._closeAllModalViewsInternal();
                }

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
        let rootContent: View;
        let launchView: AppLaunchView;

        if (isLogEnabled()) {
            bootstrapLog("NativeScriptPlatform bootstrap started.");
        }
        const launchCallback = profile(
            "@nativescript/angular/platform-common.launchCallback",
            (args: LaunchEventData) => {
                if (isLogEnabled()) {
                    bootstrapLog("Application launch event fired");
                }

                if (this.appOptions && this.appOptions.launchView) {
                  launchView = this.appOptions.launchView;
                } else {
                  launchView = new GridLayout();
                  // Custom launch view color (useful when doing async app intializers where you don't want a flash of undesirable color)
                  launchView.backgroundColor = new Color(this.appOptions && this.appOptions.backgroundColor ? this.appOptions.backgroundColor : '#fff');
                }
                args.root = launchView;
                setRootPage(<any>launchView);

                // Launch Angular app on next tick
                setTimeout(() => {
                  if (this.appOptions && this.appOptions.launchView && this.appOptions.launchView.startAnimation) {
                    // ensure launch animation is executed after launchView added to view stack
                    this.appOptions.launchView.startAnimation();
                  }
                  this._bootstrapper().then(
                    moduleRef => {

                        if (isLogEnabled()) {
                            bootstrapLog(`Angular bootstrap bootstrap done. uptime: ${uptime()}`);
                        }

                        rootContent = launchView;
                        if (launchView && launchView.cleanup) {
                          // cleanup any custom launch views
                          launchView.cleanup();
                        }

                        lastBootstrappedModule = new WeakRef(moduleRef);
                    },
                    err => {

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
                // (<any>global).Zone.drainMicroTaskQueue();
              });
            }
        );
        const exitCallback = profile(
            "@nativescript/angular/platform-common.exitCallback", (args: ApplicationEventData) => {
                const androidActivity = args.android;
                if (androidActivity && !androidActivity.isFinishing()) {
                    // Exit event was triggered as a part of a restart of the app.
                    return;
                }

                const lastModuleRef = lastBootstrappedModule ? lastBootstrappedModule.get() : null;
                if (lastModuleRef) {
                    // Make sure the module is only destroyed once
                    lastBootstrappedModule = null;

                    lastModuleRef.destroy();
                }

                rootContent = null;
            }
        );
        on(launchEvent, launchCallback);
        on(exitEvent, exitCallback);

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

        this._bootstrapper().then(
          moduleRef => {
              if (isLogEnabled()) {
                  bootstrapLog("Angular livesync done.");
              }
              onAfterLivesync.next({ moduleRef });

              lastBootstrappedModule = new WeakRef(moduleRef);
              applicationRerun({
                create: () => getRootPage(),
              });
          },
          error => {
              if (isLogEnabled()) {
                  bootstrapLogError("ERROR LIVESYNC BOOTSTRAPPING ANGULAR");
              }
              const errorMessage = error.message + "\n\n" + error.stack;
              if (isLogEnabled()) {
                  bootstrapLogError(errorMessage);
              }

              applicationRerun({
                create: () => this.createErrorUI(errorMessage),
              });
              onAfterLivesync.next({ error });
          }
      );
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
