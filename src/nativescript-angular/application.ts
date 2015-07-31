import 'reflect-metadata';
import 'nativescript-angular/polyfills/array';
import 'nativescript-angular/zone';
import {Type} from 'angular2/src/facade/lang';
import {Promise, PromiseWrapper} from 'angular2/src/facade/async';
import {ApplicationRef} from 'angular2/src/core/application';
import {bind, Binding} from 'angular2/di';
import {DOM} from 'angular2/src/dom/dom_adapter';

import {Renderer} from 'angular2/src/render/api';
import {NativeScriptRenderer} from 'nativescript-angular/renderer';
import {NativeScriptDomAdapter} from 'nativescript-angular/dom_adapter';
import {Parse5DomAdapter} from 'angular2/src/dom/parse5_adapter';

import {bootstrap as angularBootstrap} from 'angular2/src/core/application';


export type BindingList = List<Type | Binding | List<any>>;

export function nativeScriptBootstrap(appComponentType: any,
                          componentInjectableBindings: BindingList = null): Promise<ApplicationRef> {
  NativeScriptDomAdapter.makeCurrent();

  let nativeScriptBindings: BindingList = [
      NativeScriptRenderer,
      bind(Renderer).toAlias(NativeScriptRenderer)
  ];
  let augmentedBindings = nativeScriptBindings.concat(componentInjectableBindings);

  return angularBootstrap(appComponentType, augmentedBindings)
}
