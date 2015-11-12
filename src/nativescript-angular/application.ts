import 'reflect-metadata';
import 'nativescript-angular/polyfills/array';
import 'nativescript-angular/zone';
import {Type} from 'angular2/src/core/facade/lang';
import {Promise, PromiseWrapper} from 'angular2/src/core/facade/async';
import {ComponentRef} from 'angular2/src/core/linker/dynamic_component_loader';
import {bind, provide, Provider} from 'angular2/src/core/di';
import {DOM} from 'angular2/src/core/dom/dom_adapter';

import {Renderer} from 'angular2/src/core/render/api';
import {NativeScriptRenderer} from 'nativescript-angular/renderer';
import {NativeScriptDomAdapter} from 'nativescript-angular/dom_adapter';
import {TemplateNormalizer} from 'angular2/src/core/compiler/template_normalizer';
import {FileSystemTemplateNormalizer} from 'nativescript-angular/template_normalizer';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';

import {bootstrap as angularBootstrap} from 'angular2/src/core/application';


export type BindingArray = Array<Type | Provider | any[]>;

export function nativeScriptBootstrap(appComponentType: any,
                          componentInjectableBindings: BindingArray = null): Promise<ComponentRef> {
  NativeScriptDomAdapter.makeCurrent();

  let nativeScriptBindings: BindingArray = [
      NativeScriptRenderer,
      provide(Renderer, {useClass: NativeScriptRenderer}),
      provide(TemplateNormalizer, {useClass: FileSystemTemplateNormalizer}),
  ];
  let augmentedBindings = nativeScriptBindings.concat(componentInjectableBindings);

  return angularBootstrap(appComponentType, augmentedBindings)
}
