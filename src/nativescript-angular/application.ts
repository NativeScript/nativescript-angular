import 'reflect-metadata';
import './polyfills/array';
import './zone';
import {isPresent, Type} from 'angular2/src/facade/lang';
import {Promise, PromiseWrapper} from 'angular2/src/facade/async';
import {ComponentRef} from 'angular2/src/core/linker/dynamic_component_loader';
import {bind, provide, Provider} from 'angular2/src/core/di';
import {DOM} from 'angular2/src/core/dom/dom_adapter';

import {Renderer} from 'angular2/src/core/render/api';
import {NativeScriptRenderer} from './renderer';
import {NativeScriptDomAdapter} from './dom_adapter';
import {XHR} from 'angular2/src/compiler/xhr';
import {FileSystemXHR} from './xhr';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';

import {bootstrap as angularBootstrap} from 'angular2/src/core/application';
import {commonBootstrap} from 'angular2/src/core/application_common';


export type BindingArray = Array<Type | Provider | any[]>;

export function nativeScriptBootstrap(appComponentType: any,
                          componentInjectableBindings: BindingArray = null): Promise<ComponentRef> {
  NativeScriptDomAdapter.makeCurrent();

  let nativeScriptBindings: BindingArray = [
      NativeScriptRenderer,
      provide(Renderer, {useClass: NativeScriptRenderer}),
      provide(XHR, {useClass: FileSystemXHR}),
  ];
  var bindings = [nativeScriptBindings];
  if (isPresent(componentInjectableBindings)) {
      bindings.push(componentInjectableBindings);
  }

  return angularBootstrap(appComponentType, bindings)
}
