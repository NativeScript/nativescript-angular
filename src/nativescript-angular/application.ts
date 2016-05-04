import 'globals';
global.window = global;
import "zone.js/dist/zone-node"

import 'reflect-metadata';
import './polyfills/array';
import {isPresent, Type, print} from '@angular/core/src/facade/lang';
import {ReflectiveInjector, reflector, coreLoadAndBootstrap, createPlatform, 
        getPlatform, assertPlatform, ComponentRef, PlatformRef, PLATFORM_DIRECTIVES, PLATFORM_PIPES} from '@angular/core';
import {bind, provide, Provider} from '@angular/core/src/di';

import {RootRenderer, Renderer} from '@angular/core/src/render/api';
import {NativeScriptRootRenderer, NativeScriptRenderer} from './renderer';
import {NativeScriptDomAdapter, NativeScriptElementSchemaRegistry} from './dom_adapter';
import {ElementSchemaRegistry, XHR, COMPILER_PROVIDERS} from '@angular/compiler';
import {FileSystemXHR} from './xhr';
import {Parse5DomAdapter} from '@angular/platform-server/src/parse5_adapter';
import {ExceptionHandler} from '@angular/core/src/facade/exception_handler';
import {APPLICATION_COMMON_PROVIDERS} from '@angular/core/src/application_common_providers';
import {PLATFORM_COMMON_PROVIDERS} from '@angular/core/src/platform_common_providers';
import {COMMON_DIRECTIVES, COMMON_PIPES, FORM_PROVIDERS} from "@angular/common";
import {NS_DIRECTIVES} from './directives';
import {ReflectionCapabilities} from '@angular/core/src/reflection/reflection_capabilities';

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

class ConsoleLogger {
  log = print;
  logError = print;
  logGroup = print;
  logGroupEnd() {}
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
        provide(ExceptionHandler, { useFactory: () => {
            return new ExceptionHandler(new ConsoleLogger(), true)
        }, deps: [] }),

        defaultPageProvider,
        defaultDeviceProvider,
        NativeScriptRootRenderer,
        provide(RootRenderer, { useClass: NativeScriptRootRenderer }),
        NativeScriptRenderer,
        provide(Renderer, { useClass: NativeScriptRenderer }),
        provide(ElementSchemaRegistry, { useClass: NativeScriptElementSchemaRegistry }),
        COMPILER_PROVIDERS,
        provide(ElementSchemaRegistry, { useClass: NativeScriptElementSchemaRegistry }),
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
