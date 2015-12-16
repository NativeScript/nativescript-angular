import { Type, ApplicationRef, Provider } from 'angular2/core';

export type BindingArray = Array<Type | Provider | Array<any>>;
export function nativeScriptBootstrap(appComponentType: any, componentInjectableBindings?: BindingArray): Promise<ApplicationRef>;
