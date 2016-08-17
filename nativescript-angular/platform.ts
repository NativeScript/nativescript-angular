import 'globals';
import "zone.js/dist/zone-node";

import 'reflect-metadata';
import './polyfills/array';
import './polyfills/console';

import {
    ElementSchemaRegistry,
    XHR,
    COMPILER_PROVIDERS,
    CompilerConfig,
    platformCoreDynamic
} from '@angular/compiler';
import {CommonModule} from '@angular/common';
import {provide, Provider} from '@angular/core';
import {NativeScriptRootRenderer, NativeScriptRenderer} from './renderer';
import {
    Injector,
    OpaqueToken,
    ApplicationModule,
    ExceptionHandler,
    platformCore,
    CompilerOptions,
    COMPILER_OPTIONS,
    CompilerFactory,
    PLATFORM_INITIALIZER,
    Renderer,
    RootRenderer,
    SanitizationService,
    PlatformRef,
    ComponentRef,
    NgModule,
    NgModuleFactory,
    NgModuleRef,
    EventEmitter,
    createPlatformFactory
} from '@angular/core';
import * as application from "application";
import { topmost, NavigationEntry } from "ui/frame";
import { Page } from 'ui/page';
import { rendererLog, rendererError } from "./trace";
import { TextView } from 'ui/text-view';
import { PlatformFactory } from "@angular/core/src/application_ref";
import { isPresent, Type, ConcreteType, print } from '@angular/core/src/facade/lang';
import { defaultPageProvider, defaultFrameProvider, defaultDeviceProvider, defaultAnimationDriverProvider
} from "./platform-providers";
import { NativeScriptDomAdapter, NativeScriptElementSchemaRegistry, NativeScriptSanitizationService
} from './dom-adapter';
import { FileSystemXHR } from './http/xhr';
import { NS_DIRECTIVES } from './directives';

import * as nativescriptIntl from "nativescript-intl";
global.Intl = nativescriptIntl;

export interface AppOptions {
    cssFile?: string;
    startPageActionBarHidden?: boolean;
}

class ConsoleLogger {
    log = print;
    logError = print;
    logGroup = print;
    logGroupEnd() { }
}

@NgModule({
    declarations: [
        NS_DIRECTIVES
    ],
    providers: [
        provide(ExceptionHandler, {
            useFactory: () => {
                return new ExceptionHandler(new ConsoleLogger(), true)
            }, deps: []
        }),

        defaultFrameProvider,
        defaultPageProvider,
        defaultDeviceProvider,
        defaultAnimationDriverProvider,
        NativeScriptRootRenderer,
        provide(RootRenderer, { useClass: NativeScriptRootRenderer }),
        NativeScriptRenderer,
        provide(Renderer, { useClass: NativeScriptRenderer }),
        provide(SanitizationService, { useClass: NativeScriptSanitizationService }),
    ],
    imports: [
        CommonModule,
        ApplicationModule,
    ],
    exports: [
        CommonModule,
        ApplicationModule,
        NS_DIRECTIVES
    ]
})
export class NativeScriptModule {
}

export const NS_COMPILER_PROVIDERS = [
    COMPILER_PROVIDERS,
    {
        provide: COMPILER_OPTIONS,
        useValue: {providers: [
            {provide: XHR, useClass: FileSystemXHR},
            provide(ElementSchemaRegistry, { useClass: NativeScriptElementSchemaRegistry }),
        ]},
        multi: true
    }
];

type BootstrapperAction = () => Promise<NgModuleRef<any>>;

let lastBootstrappedModule: WeakRef<NgModuleRef<any>>;
interface BootstrapParams {
    appModuleType: Type,
    appOptions?: AppOptions
}

let bootstrapCache: BootstrapParams;

class NativeScriptPlatformRef extends PlatformRef {
    constructor(private platform: PlatformRef, private appOptions?: AppOptions) {
        super();
    }

    bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>> {
        throw new Error("Not implemented.");
    }

    private _bootstrapper: BootstrapperAction;

    bootstrapModule<M>(moduleType: ConcreteType<M>, compilerOptions: CompilerOptions | CompilerOptions[] = []): Promise<NgModuleRef<M>> {
        this._bootstrapper = () => this.platform.bootstrapModule(moduleType, compilerOptions);
        // Patch livesync
        global.__onLiveSyncCore = () => this.livesyncModule();

        const mainPageEntry = this.createNavigationEntry(this._bootstrapper);

        application.start(mainPageEntry);

        return null; //Make the compiler happy
    }

    livesyncModule(): void {
        rendererLog("ANGULAR LiveSync Started");

        onBeforeLivesync.next(lastBootstrappedModule ? lastBootstrappedModule.get() : null);

        const mainPageEntry = this.createNavigationEntry(
            this._bootstrapper,
            compRef => onAfterLivesync.next(compRef),
            error => onAfterLivesync.error(error)
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
 
    registerDisposeListener(dispose: () => void): void {
        this.platform.registerDisposeListener(dispose);
    }

    onDestroy(callback: () => void): void {
        this.platform.onDestroy(callback);
    }

    get injector(): Injector {
        return this.platform.injector;
    };

    dispose(): void {
        this.platform.dispose();
    }

    destroy(): void {
        this.platform.destroy();
    }

    get disposed(): boolean {
        return this.platform.disposed;
    }

    get destroyed(): boolean {
        return this.platform.destroyed;
    }

    private createNavigationEntry(bootstrapAction: BootstrapperAction, resolve?: (comp: NgModuleRef<any>) => void, reject?: (e: Error) => void, isReboot: boolean = false): NavigationEntry {
        const navEntry: NavigationEntry = {
            create: (): Page => {
                let page = new Page();
                if (this.appOptions) {
                    page.actionBarHidden = this.appOptions.startPageActionBarHidden;
                }

                let onLoadedHandler = function (args) {
                    page.off('loaded', onLoadedHandler);
                    //profiling.stop('application-start');
                    rendererLog('Page loaded');

                    //profiling.start('ng-bootstrap');
                    rendererLog('BOOTSTRAPPING...');
                    bootstrapAction().then((moduleRef) => {
                        //profiling.stop('ng-bootstrap');
                        rendererLog('ANGULAR BOOTSTRAP DONE.');
                        lastBootstrappedModule = new WeakRef(moduleRef);

                        if (resolve) {
                            resolve(moduleRef);
                        }
                        return moduleRef;
                    }, (err) => {
                        rendererError('ERROR BOOTSTRAPPING ANGULAR');
                        let errorMessage = err.message + "\n\n" + err.stack;
                        rendererError(errorMessage);

                        let view = new TextView();
                        view.text = errorMessage;
                        page.content = view;

                        if (reject) {
                            reject(err);
                        }
                    });
                };

                page.on('loaded', onLoadedHandler);

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

var _platformNativeScriptDynamic: PlatformFactory = createPlatformFactory(
    platformCoreDynamic, 'nativeScriptDynamic', NS_COMPILER_PROVIDERS);

export function platformNativeScriptDynamic(options?: AppOptions, extraProviders?: any[]): PlatformRef {
    return new NativeScriptPlatformRef(_platformNativeScriptDynamic(extraProviders), options);
}

export const onBeforeLivesync = new EventEmitter<NgModuleRef<any>>();
export const onAfterLivesync = new EventEmitter<NgModuleRef<any>>();

