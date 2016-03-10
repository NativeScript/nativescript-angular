import {View} from 'ui/core/view';

export type ViewResolver = () => ViewClass;

export type NgView = View & ViewExtensions;

export interface ViewExtensions {
    nodeName: string;
    templateParent: NgView;
    cssClasses: Map<string, boolean>;
    meta: ViewClassMeta;
}

export interface ViewClassMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: NgView, child: NgView, atIndex: number) => void;
    removeChild?: (parent: NgView, child: NgView) => void;
}

export interface ViewClass {
    new(): View
}


export function registerElement(elementName: string, resolver: ViewResolver): void;
export function getViewClass(elementName: string): ViewClass;
export function isKnownView(elementName: string): boolean;
export function getViewMeta(nodeName: string): ViewClassMeta;