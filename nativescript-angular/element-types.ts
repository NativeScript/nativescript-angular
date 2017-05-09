import { View } from "tns-core-modules/ui/core/view";

export type NgView = (View & ViewExtensions);
export type NgElement = NgView | CommentNode;

export interface ViewExtensions {
    nodeType: number;
    nodeName: string;
    templateParent: NgView;
    ngCssClasses: Map<string, boolean>;
    meta: ViewClassMeta;
}

export interface ViewClass {
    new (): View;
}

// used for creating comments and text nodes in the renderer
export class CommentNode {
    meta: { skipAddToDom: true };
    templateParent: NgView;
}

export interface ViewClassMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: NgView, child: NgView, atIndex: number) => void;
    removeChild?: (parent: NgView, child: NgView) => void;
}

export function isDetachedElement(element): boolean {
    return (element && element.meta && element.meta.skipAddToDom);
}
