declare module "nativescript-angular/application" {
    import { Type, ApplicationRef, Binding } from 'angular2/angular2';

    export type BindingList = List<Type | Binding | List<any>>;
    export function nativeScriptBootstrap(appComponentType: any, componentInjectableBindings?: BindingList): Promise<ApplicationRef>;
}
