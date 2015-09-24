declare module "nativescript-angular/element-registry" {
    import {View} from 'ui/core/view';

    export interface TypeId {
        moduleName: string;
        className: string;
    }

    export interface ViewClass {
        new(): View
    }

    export function registerElement(elementName: string, typeId: TypeId): void;
    export function isKnownView(elementName: string): boolean;
    export function getViewClass(elementName: string): ViewClass;
}
