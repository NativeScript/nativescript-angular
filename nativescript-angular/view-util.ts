import { isDefined } from "tns-core-modules/utils/types";
import { View, unsetValue } from "tns-core-modules/ui/core/view";
import { Placeholder } from "tns-core-modules/ui/placeholder";
import { ContentView } from "tns-core-modules/ui/content-view";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import {
    CommentNode,
    ElementReference,
    InvisibleNode,
    NgElement,
    NgView,
    TextNode,
    ViewExtensions,
    getViewClass,
    getViewMeta,
    isDetachedElement,
    isKnownView,
} from "./element-registry";

import { platformNames, Device } from "tns-core-modules/platform";
import { rendererLog as traceLog } from "./trace";

const ELEMENT_NODE_TYPE = 1;
const XML_ATTRIBUTES = Object.freeze(["style", "rows", "columns", "fontAttributes"]);
const whiteSpaceSplitter = /\s+/;

export type ViewExtensions = ViewExtensions;
export type NgView = NgView;
export type NgLayoutBase = LayoutBase & ViewExtensions;
export type NgContentView = ContentView & ViewExtensions;
export type NgPlaceholder = Placeholder & ViewExtensions;
export type BeforeAttachAction = (view: View) => void;

export function isView(view: any): view is NgView {
    return view instanceof View;
}

export function isLayout(view: any): view is NgLayoutBase {
    return view instanceof LayoutBase;
}

export function isContentView(view: any): view is NgContentView {
    return view instanceof ContentView;
}

const propertyMaps: Map<Function, Map<string, string>> = new Map<Function, Map<string, string>>();

export class ViewUtil {
    private isIos: boolean;
    private isAndroid: boolean;

    constructor(device: Device) {
        this.isIos = device.os === platformNames.ios;
        this.isAndroid = device.os === platformNames.android;
    }

    public insertChild(parent: NgView, child: NgElement, previous?: NgElement, next?: NgElement) {
        if (!parent) {
            return;
        }

        this.addToQueue(parent, child, previous, next);

        if (isDetachedElement(child)) {
            child.templateParent = parent;
        } else {
            this.addToVisualTree(parent, child, next);
        }
    }

    private addToQueue(parent: NgElement, child: NgElement, previous: NgElement, next: NgElement) {
        if (next) {
            this.insertBetween(child, previous, next);
        } else {
            this.appendToQueue(parent, child);
        }
    }

    private insertBetween(
        view: NgElement,
        previous: NgElement,
        next: NgElement
    ): void {
        previous.nextSibling = view;
        view.nextSibling = next;
    }

    private appendToQueue(parent: NgElement, view: NgElement) {
        if (parent.lastChild) {
            parent.lastChild.nextSibling = view;
        }

        parent.lastChild = view;
    }

    private addToVisualTree(parent: NgView, child: NgView, next: NgView): void {
        if (parent.meta && parent.meta.insertChild) {
            parent.meta.insertChild(parent, child);
        } else if (isLayout(parent)) {
            this.insertToLayout(parent, child, next);
        } else if (isContentView(parent)) {
            parent.content = child;
        } else if (parent && (<any>parent)._addChildFromBuilder) {
            (<any>parent)._addChildFromBuilder(child.nodeName, child);
        }
    }

    private insertToLayout(
        parent: NgLayoutBase,
        child: NgView,
        next: NgView
    ): void {
        if (child.parent === parent) {
            this.removeLayoutChild(parent, child);
        }

        if (next) {
            const index = parent.getChildIndex(next);
            parent.insertChild(child, index);
        } else {
            parent.addChild(child);
        }
    }

    public removeChild(parent: NgView, child: NgElement) {
        if (!parent) {
            return;
        }

        if (parent.meta && parent.meta.removeChild) {
            parent.meta.removeChild(parent, child);
        } else if (isLayout(parent)) {
            this.removeLayoutChild(parent, child);
        } else if (isContentView(parent) && parent.content === child) {
            parent.content = null;
        } else if (isView(parent)) {
            parent._removeView(child);
        }
    }

    private removeLayoutChild(parent: NgLayoutBase, child: NgView): void {
        const index = parent.getChildIndex(child);
        if (index === -1) {
            return;
        }

        this.removeFromQueue(parent, child, index);
        parent.removeChild(child);
    }

    private removeFromQueue(parent: NgLayoutBase, child: NgView, index: number) {
        let previous = parent.getChildAt(index - 1) as NgElement;
        if (!previous) {
            return;
        }

        // since detached elements are not added to the visual tree,
        // we need to find the actual previous sibling of the view,
        // which may be an invisible node
        while (previous && previous !== child && isDetachedElement(previous.nextSibling)) {
            previous = previous.nextSibling;
        }

        previous.nextSibling = child.nextSibling;
    }

    public getChildIndex(parent: any, child: NgView) {
        if (isLayout(parent)) {
            return parent.getChildIndex(child);
        } else if (isContentView(parent)) {
            return child === parent.content ? 0 : -1;
        }
    }

    public createComment(): InvisibleNode {
        return new CommentNode();
    }

    public createText(): InvisibleNode {
        return new TextNode();
    }

    public createView(name: string): NgView {
        traceLog(`Creating view: ${name}`);

        if (!isKnownView(name)) {
            name = "ProxyViewContainer";
        }

        const viewClass = getViewClass(name);
        let view = <NgView>new viewClass();
        view.nodeName = name;
        view.meta = getViewMeta(name);

        // we're setting the node type of the view
        // to 'element' because of checks done in the
        // dom animation engine
        view.nodeType = ELEMENT_NODE_TYPE;

        return view;
    }

    public setProperty(view: NgView, attributeName: string, value: any, namespace?: string): void {
        if (namespace && !this.runsIn(namespace)) {
            return;
        }

        if (attributeName.indexOf(".") !== -1) {
            // Handle nested properties
            const properties = attributeName.split(".");
            attributeName = properties[properties.length - 1];

            let propMap = this.getProperties(view);
            let i = 0;
            while (i < properties.length - 1 && isDefined(view)) {
                let prop = properties[i];
                if (propMap.has(prop)) {
                    prop = propMap.get(prop);
                }

                view = view[prop];
                propMap = this.getProperties(view);
                i++;
            }
        }

        if (isDefined(view)) {
            this.setPropertyInternal(view, attributeName, value);
        }
    }

    // finds the node in the parent's views and returns the next index
    // returns -1 if the node has no parent or next sibling
    // public nextSiblingIndex(node: NgView): number {
    //     const parent = node.parent;
    //     if (!parent) {
    //         return -1;
    //     }

    //     let index = 0;
    //     let found = false;
    //     parent.eachChild(child => {
    //         if (child === node) {
    //             found = true;
    //         }

    //         index += 1;
    //         return !found;
    //     });

    //     return found ? index : -1;
    // }

    private runsIn(platform: string): boolean {
        return (platform === "ios" && this.isIos) ||
            (platform === "android" && this.isAndroid);
    }

    private setPropertyInternal(view: NgView, attributeName: string, value: any): void {
        traceLog(`Setting attribute: ${attributeName}=${value} to ${view}`);

        if (attributeName === "class") {
            this.setClasses(view, value);
            return;
        }

        if (XML_ATTRIBUTES.indexOf(attributeName) !== -1) {
            view._applyXmlAttribute(attributeName, value);
            return;
        }

        const propMap = this.getProperties(view);
        const propertyName = propMap.get(attributeName);
        if (propertyName) {
            // We have a lower-upper case mapped property.
            view[propertyName] = value;
            return;
        }

        // Unknown attribute value -- just set it to our object as is.
        view[attributeName] = value;
    }

    private getProperties(instance: any): Map<string, string> {
        const type = instance && instance.constructor;
        if (!type) {
            return new Map<string, string>();
        }

        if (!propertyMaps.has(type)) {
            let propMap = new Map<string, string>();
            for (let propName in instance) { // tslint:disable:forin
                propMap.set(propName.toLowerCase(), propName);
            }
            propertyMaps.set(type, propMap);
        }

        return propertyMaps.get(type);
    }

    private cssClasses(view: NgView) {
        if (!view.ngCssClasses) {
            view.ngCssClasses = new Map<string, boolean>();
        }
        return view.ngCssClasses;
    }

    public addClass(view: NgView, className: string): void {
        this.cssClasses(view).set(className, true);
        this.syncClasses(view);
    }

    public removeClass(view: NgView, className: string): void {
        this.cssClasses(view).delete(className);
        this.syncClasses(view);
    }

    private setClasses(view: NgView, classesValue: string): void {
        let classes = classesValue.split(whiteSpaceSplitter);
        this.cssClasses(view).clear();
        classes.forEach((className) => this.cssClasses(view).set(className, true));
        this.syncClasses(view);
    }

    private syncClasses(view: NgView): void {
        let classValue = (<any>Array).from(this.cssClasses(view).keys()).join(" ");
        view.className = classValue;
    }

    public setStyle(view: NgView, styleName: string, value: any) {
        view.style[styleName] = value;
    }

    public removeStyle(view: NgView, styleName: string) {
        view.style[styleName] = unsetValue;
    }
}

