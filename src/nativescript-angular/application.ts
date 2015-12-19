import 'reflect-metadata';
import './polyfills/array';
import './zone';
import {isPresent, Type} from 'angular2/src/facade/lang';
import {Promise, PromiseWrapper} from 'angular2/src/facade/async';
import {platform, ComponentRef, PLATFORM_DIRECTIVES, PLATFORM_PIPES} from 'angular2/core';
import {bind, provide, Provider} from 'angular2/src/core/di';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';

import {Renderer} from 'angular2/src/core/render/api';
import {NativeScriptRenderer} from './renderer';
import {NativeScriptDomAdapter} from './dom_adapter';
import {XHR} from 'angular2/src/compiler/xhr';
import {FileSystemXHR} from './xhr';
import {Parse5DomAdapter} from 'angular2/src/platform/server/parse5_adapter';
import {ExceptionHandler} from 'angular2/src/facade/exception_handler';
import {APPLICATION_COMMON_PROVIDERS} from 'angular2/src/core/application_common_providers';
import {COMPILER_PROVIDERS} from 'angular2/src/compiler/compiler';
import {PLATFORM_COMMON_PROVIDERS} from 'angular2/src/core/platform_common_providers';
import {COMMON_DIRECTIVES, COMMON_PIPES, FORM_PROVIDERS} from "angular2/common";

import {bootstrap as angularBootstrap} from 'angular2/bootstrap';

export type ProviderArray = Array<Type | Provider | any[]>;

export function nativeScriptBootstrap(appComponentType: any,
                          customProviders: ProviderArray = null): Promise<ComponentRef> {
  NativeScriptDomAdapter.makeCurrent();

  let nativeScriptProviders: ProviderArray = [
      NativeScriptRenderer,
      provide(Renderer, {useClass: NativeScriptRenderer}),
      provide(XHR, {useClass: FileSystemXHR}),
      provide(ExceptionHandler, {useFactory: () => new ExceptionHandler(DOM, true), deps: []}),

      provide(PLATFORM_PIPES, {useValue: COMMON_PIPES, multi: true}),
      provide(PLATFORM_DIRECTIVES, {useValue: COMMON_DIRECTIVES, multi: true}),

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
