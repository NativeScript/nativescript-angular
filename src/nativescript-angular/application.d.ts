import { Type, ComponentRef, Provider } from 'angular2/core';

export interface AppOptions {
    cssFile?: string;
    startPageActionBarHidden?: boolean;
}

export type ProviderArray = Array<Type | Provider | Array<any>>;
export function bootstrap(appComponentType: any, componentInjectableBindings?: ProviderArray): Promise<ComponentRef>;
export function nativeScriptBootstrap(appComponentType: any, customProviders?: ProviderArray, appOptions?: any): void;
