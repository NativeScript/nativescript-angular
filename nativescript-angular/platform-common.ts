// Initial imports and polyfills
import "tns-core-modules/globals";
// Require application early to work around a circular import
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";
import "reflect-metadata";
import "./polyfills/array";
import "./polyfills/console";
import { profile, log, uptime } from "tns-core-modules/profiling";

import {
    Type,
    Injector,
    CompilerOptions,
    PlatformRef,
    NgModuleFactory,
    NgModuleRef,
    EventEmitter,
    Provider,
    Sanitizer,
    InjectionToken,
    StaticProvider
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { rendererLog, rendererError } from "./trace";
import {
    PAGE_FACTORY,
    PageFactory,
    defaultPageFactoryProvider,
    setRootPage
} from "./platform-providers";

import { start, setCssFileName } from "tns-core-modules/application";
import { topmost, NavigationEntry } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { TextView } from "tns-core-modules/ui/text-view";

import "nativescript-intl";

export const onBeforeLivesync = new EventEmitter<NgModuleRef<any>>();
export const onAfterLivesync = new EventEmitter<NgModuleRef<any>>();
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

export class NativeScriptDocument {
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

    constructor(private platform: PlatformRef, private appOptions?: AppOptions) {
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
        (<any>global).__onLiveSyncCore = () => this.livesyncModule();

        const mainPageEntry = this.createNavigationEntry(this._bootstrapper);

        if (this.appOptions && typeof this.appOptions.cssFile === "string") {
            // TODO: All exported fields in ES6 modules should be read-only
            // Change the case when tns-core-modules become ES6 compatible and there is a legal way to set cssFile
            setCssFileName(this.appOptions.cssFile);
        }
        start(mainPageEntry);
    }

    livesyncModule(): void {
        rendererLog("ANGULAR LiveSync Started");

        onBeforeLivesync.next(lastBootstrappedModule ? lastBootstrappedModule.get() : null);

        const mainPageEntry = this.createNavigationEntry(
            this._bootstrapper,
            compRef => onAfterLivesync.next(compRef),
            error => onAfterLivesync.error(error),
            true
        );
        mainPageEntry.animated = false;
        mainPageEntry.clearHistory = true;

        const frame = topmost();
        if (frame) {
            if (frame.currentPage && frame.currentPage.modal) {
                frame.currentPage.modal.closeModal();
            }
            frame.navigate(mainPageEntry);
        }
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
    private createNavigationEntry(
        bootstrapAction: BootstrapperAction,
        resolve?: (comp: NgModuleRef<any>) => void,
        reject?: (e: Error) => void,
        isLivesync: boolean = false,
        isReboot: boolean = false): NavigationEntry {

        const pageFactory: PageFactory = this.platform.injector.get(PAGE_FACTORY);

        const navEntry: NavigationEntry = {
            create: (): Page => {
                const page = pageFactory({ isBootstrap: true, isLivesync });
                setRootPage(page);
                if (this.appOptions) {
                    page.actionBarHidden = this.appOptions.startPageActionBarHidden;
                }

                const initHandlerMethodName =
                    "nativescript-angular/platform-common.initHandler";
                const initHandler = profile(initHandlerMethodName, () => {
                    page.off(Page.navigatingToEvent, initHandler);
                    // profiling.stop("application-start");
                    rendererLog("Page loaded");

                    // profiling.start("ng-bootstrap");
                    rendererLog("BOOTSTRAPPING...");

                    const bootstrapMethodName =
                        "nativescript-angular/platform-common.postBootstrapAction";
                    bootstrapAction().then(profile(bootstrapMethodName, moduleRef => {
                        // profiling.stop("ng-bootstrap");
                        log(`ANGULAR BOOTSTRAP DONE. ${uptime()}`);
                        lastBootstrappedModule = new WeakRef(moduleRef);

                        if (resolve) {
                            resolve(moduleRef);
                        }
                        return moduleRef;
                    }), err => {
                        rendererError("ERROR BOOTSTRAPPING ANGULAR");
                        const errorMessage = err.message + "\n\n" + err.stack;
                        rendererError(errorMessage);

                        let view = new TextView();
                        view.text = errorMessage;
                        page.content = view;

                        if (reject) {
                            reject(err);
                        }
                    });
                });

                page.on(Page.navigatingToEvent, initHandler);

                return page;
            }
        };

        if (isReboot) {
            navEntry.animated = false;
            navEntry.clearHistory = true;
        }

        return navEntry;
    }

    liveSyncApp() {
    }
}
