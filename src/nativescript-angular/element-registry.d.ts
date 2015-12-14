import {View} from 'ui/core/view';

export type ViewResolver = () => ViewClass;

export interface ViewClass {
    new(): View
}

export function registerElement(elementName: string, resolver: ViewResolver): void;
export function getViewClass(elementName: string): ViewClass;
export function isKnownView(elementName: string): boolean;
