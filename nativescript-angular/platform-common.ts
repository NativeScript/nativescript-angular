// Initial imports and polyfills
import 'globals';
import './zone.js/dist/zone-nativescript';
import 'reflect-metadata';
import './polyfills/array';
import './polyfills/console';

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
  OpaqueToken,
} from '@angular/core';

import { rendererLog, rendererError } from "./trace";
import { PAGE_FACTORY, PageFactory, defaultPageFactoryProvider } from './platform-providers';

import * as application from "application";
import { topmost, NavigationEntry } from "ui/frame";
import { Page } from 'ui/page';
import { TextView } from 'ui/text-view';

import * as nativescriptIntl from "nativescript-intl";
global.Intl = nativescriptIntl;

export const onBeforeLivesync = new EventEmitter<NgModuleRef<any>>();
export const onAfterLivesync = new EventEmitter<NgModuleRef<any>>();
let lastBootstrappedModule: WeakRef<NgModuleRef<any>>;
type BootstrapperAction = () => Promise<NgModuleRef<any>>;

interface BootstrapParams {
  appModuleType: Type<any>;
  appOptions?: AppOptions;
}

export interface AppOptions {
  bootInExistingPage: boolean;
  cssFile?: string;
  startPageActionBarHidden?: boolean;
}

export type PlatformFactory = (extraProviders?: Provider[]) => PlatformRef;

export class NativeScriptSanitizer extends Sanitizer {
  sanitize(context: any, value: string): string {
    return value;
  }
}

export const COMMON_PROVIDERS = [
  defaultPageFactoryProvider,
  { provide: Sanitizer, useClass: NativeScriptSanitizer },
];

export class NativeScriptPlatformRef extends PlatformRef {
  private _bootstrapper: BootstrapperAction;

  constructor(private platform: PlatformRef, private appOptions?: AppOptions) {
    super();
  }

  bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>> {
    this._bootstrapper = () => this.platform.bootstrapModuleFactory(moduleFactory);

    this.bootstrapApp();

    return null; //Make the compiler happy
  }

  bootstrapModule<M>(moduleType: Type<M>, compilerOptions: CompilerOptions | CompilerOptions[] = []): Promise<NgModuleRef<M>> {
    this._bootstrapper = () => this.platform.bootstrapModule(moduleType, compilerOptions);

    this.bootstrapApp();

    return null; //Make the compiler happy
  }

  private bootstrapApp() {
    global.__onLiveSyncCore = () => this.livesyncModule();

    const mainPageEntry = this.createNavigationEntry(this._bootstrapper);

    application.start(mainPageEntry);
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
  };

  destroy(): void {
    this.platform.destroy();
  }

  get destroyed(): boolean {
    return this.platform.destroyed;
  }

  private createNavigationEntry(
    bootstrapAction: BootstrapperAction,
    resolve?: (comp: NgModuleRef<any>) => void,
    reject?: (e: Error) => void,
    isLivesync: boolean = false,
    isReboot: boolean = false): NavigationEntry {

    const pageFactory: PageFactory = this.platform.injector.get(PAGE_FACTORY);

    const navEntry: NavigationEntry = {
      create: (): Page => {
        let page = pageFactory({ isBootstrap: true, isLivesync });
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
