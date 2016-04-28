import 'globals';
import "zone.js/dist/zone-node"

import 'reflect-metadata';
import './polyfills/array';
import {isPresent, Type} from 'angular2/src/facade/lang';
import {ReflectiveInjector, reflector, coreLoadAndBootstrap, createPlatform, 
        getPlatform, assertPlatform, ComponentRef, PlatformRef, PLATFORM_DIRECTIVES, PLATFORM_PIPES} from 'angular2/core';
import {bind, provide, Provider} from 'angular2/src/core/di';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';

import {RootRenderer, Renderer} from 'angular2/src/core/render/api';
import {NativeScriptRootRenderer, NativeScriptRenderer} from './renderer';
import {NativeScriptDomAdapter} from './dom_adapter';
import {XHR} from 'angular2/src/compiler/xhr';
import {FileSystemXHR} from './xhr';
import {Parse5DomAdapter} from 'angular2/src/platform/server/parse5_adapter';
import {ExceptionHandler} from 'angular2/src/facade/exception_handler';
import {APPLICATION_COMMON_PROVIDERS} from 'angular2/src/core/application_common_providers';
import {COMPILER_PROVIDERS} from 'angular2/src/compiler/compiler';
import {PLATFORM_COMMON_PROVIDERS} from 'angular2/src/core/platform_common_providers';
import {COMMON_DIRECTIVES, COMMON_PIPES, FORM_PROVIDERS} from "angular2/common";
import {NS_DIRECTIVES} from './directives';
import {ReflectionCapabilities} from 'angular2/src/core/reflection/reflection_capabilities';
import {bootstrap as angularBootstrap} from 'angular2/platform/browser';

import {Page} from 'ui/page';
import {TextView} from 'ui/text-view';
import application = require('application');

export type ProviderArray = Array<Type | Provider | any[]>;

import {defaultPageProvider, defaultDeviceProvider} from "./platform-providers";

import * as nativescriptIntl from "nativescript-intl";
global.Intl = nativescriptIntl;

export interface AppOptions {
    cssFile?: string;
    startPageActionBarHidden?: boolean;
}

export function bootstrap(appComponentType: any,
    customProviders: ProviderArray = null): Promise<ComponentRef> {
    NativeScriptDomAdapter.makeCurrent();

    let platformProviders: ProviderArray = [
        PLATFORM_COMMON_PROVIDERS,
    ];

    let defaultAppProviders: ProviderArray = [
        APPLICATION_COMMON_PROVIDERS,
        FORM_PROVIDERS,
        provide(PLATFORM_PIPES, { useValue: COMMON_PIPES, multi: true }),
        provide(PLATFORM_DIRECTIVES, { useValue: COMMON_DIRECTIVES, multi: true }),
        provide(PLATFORM_DIRECTIVES, { useValue: NS_DIRECTIVES, multi: true }),
        provide(ExceptionHandler, { useFactory: () => new ExceptionHandler(DOM, true), deps: [] }),

        defaultPageProvider,
        defaultDeviceProvider,
        NativeScriptRootRenderer,
        provide(RootRenderer, { useClass: NativeScriptRootRenderer }),
        NativeScriptRenderer,
        provide(Renderer, { useClass: NativeScriptRenderer }),
        COMPILER_PROVIDERS,
        provide(XHR, { useClass: FileSystemXHR }),
    ]

    var appProviders = [defaultAppProviders];
    if (isPresent(customProviders)) {
        appProviders.push(customProviders);
    }

    var platform = getPlatform();    
    if (!isPresent(platform)) {
        platform = createPlatform(ReflectiveInjector.resolveAndCreate(platformProviders));
    }
    
    reflector.reflectionCapabilities = new ReflectionCapabilities();
    var appInjector = ReflectiveInjector.resolveAndCreate(appProviders, platform.injector);
    return coreLoadAndBootstrap(appInjector, appComponentType);
}

export function nativeScriptBootstrap(appComponentType: any, customProviders?: ProviderArray, appOptions?: AppOptions): Promise<ComponentRef> {
    if (appOptions && appOptions.cssFile) {
        application.cssFile = appOptions.cssFile;
    }

    return new Promise((resolve, reject) => {
        application.start({
            create: (): Page => {
                let page = new Page();
                if (appOptions) {
                    page.actionBarHidden = appOptions.startPageActionBarHidden;
                }

                let onLoadedHandler = function(args) {
                    page.off('loaded', onLoadedHandler);
                    //profiling.stop('application-start');
                    console.log('Page loaded');

                    //profiling.start('ng-bootstrap');
                    console.log('BOOTSTRAPPING...');
                    bootstrap(appComponentType, customProviders).then((appRef) => {
                        //profiling.stop('ng-bootstrap');
                        console.log('ANGULAR BOOTSTRAP DONE.');
                        resolve(appRef);
                    }, (err) => {
                        console.log('ERROR BOOTSTRAPPING ANGULAR');
                        let errorMessage = err.message + "\n\n" + err.stack;
                        console.log(errorMessage);

                        let view = new TextView();
                        view.text = errorMessage;
                        page.content = view;
                        reject(err);
                    });
                }

                page.on('loaded', onLoadedHandler);

                return page;
            }
        });
    })
}
