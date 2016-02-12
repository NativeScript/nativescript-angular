//Import globals before the zone, so the latter can patch the global functions
import 'globals';
import "zone.js/dist/zone.js"
import 'reflect-metadata';
import './polyfills/array';
import {isPresent, Type} from 'angular2/src/facade/lang';
import {Promise, PromiseWrapper} from 'angular2/src/facade/async';
import {platform, ComponentRef, PLATFORM_DIRECTIVES, PLATFORM_PIPES} from 'angular2/core';
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
import {NS_DIRECTIVES} from './directives/ns-directives';

import {bootstrap as angularBootstrap} from 'angular2/bootstrap';

import { Page } from 'ui/page';
import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';
import application = require('application');

export type ProviderArray = Array<Type | Provider | any[]>;

export function bootstrap(appComponentType: any,
                          customProviders: ProviderArray = null) : Promise<ComponentRef> {
    NativeScriptDomAdapter.makeCurrent();

    let nativeScriptProviders: ProviderArray = [
        NativeScriptRootRenderer,
        provide(RootRenderer, {useClass: NativeScriptRootRenderer}),
        NativeScriptRenderer,
        provide(Renderer, {useClass: NativeScriptRenderer}),
        provide(XHR, {useClass: FileSystemXHR}),
        provide(ExceptionHandler, {useFactory: () => new ExceptionHandler(DOM, true), deps: []}),

        provide(PLATFORM_PIPES, {useValue: COMMON_PIPES, multi: true}),
        provide(PLATFORM_DIRECTIVES, {useValue: COMMON_DIRECTIVES, multi: true}),
        provide(PLATFORM_DIRECTIVES, {useValue: NS_DIRECTIVES, multi: true}),

        APPLICATION_COMMON_PROVIDERS,
        COMPILER_PROVIDERS,
        PLATFORM_COMMON_PROVIDERS,
        FORM_PROVIDERS,
    ];

    var appProviders = [];
    if (isPresent(customProviders)) {
        appProviders.push(customProviders);
    }
  
    return platform(nativeScriptProviders).application(appProviders).bootstrap(appComponentType);
}

export function nativeScriptBootstrap(appComponentType: any, customProviders?: ProviderArray, appOptions?: any) {
    if (appOptions && appOptions.cssFile) {
        application.cssFile = appOptions.cssFile;
    }
    application.start({
        create: (): Page => {
            let page = new Page();
            
            let onLoadedHandler = function(args) {
                page.off('loaded', onLoadedHandler);
                //profiling.stop('application-start');
                console.log('Page loaded');

                //profiling.start('ng-bootstrap');
                console.log('BOOTSTRAPPING...');
                bootstrap(appComponentType, customProviders).then((appRef) => {
                    //profiling.stop('ng-bootstrap');
                    console.log('ANGULAR BOOTSTRAP DONE.');
                }, (err) =>{
                    console.log('ERROR BOOTSTRAPPING ANGULAR');
                    let errorMessage = err.message + "\n\n" + err.stack;
                    console.log(errorMessage);

                    let view = new TextView();
                    view.text = errorMessage;
                    topmost().currentPage.content = view;
                });
            }
            
            page.on('loaded', onLoadedHandler);
            
            return page;
        }
    });
}
