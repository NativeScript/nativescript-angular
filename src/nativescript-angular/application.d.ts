declare module "nativescript-angular/application" {
    import { Type, ApplicationRef, Binding } from 'angular2/angular2';

    export type BindingArray = Array<Type | Binding | Array<any>>;
    export function nativeScriptBootstrap(appComponentType: any, componentInjectableBindings?: BindingArray): Promise<ApplicationRef>;
}
