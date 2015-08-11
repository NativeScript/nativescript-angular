declare module "nativescript-angular/application" {
    import { Type, ApplicationRef, Binding } from 'angular2/angular2';
    //import { ApplicationRef } from 'angular2/src/core/application';
    //import { Binding } from 'angular2/di';

    export type BindingList = List<Type | Binding | List<any>>;
    export function nativeScriptBootstrap(appComponentType: any, componentInjectableBindings?: BindingList): Promise<ApplicationRef>;
}
