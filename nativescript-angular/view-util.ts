import { isDefined } from "tns-core-modules/utils/types";
import { View, unsetValue } from "tns-core-modules/ui/core/view";
import { Placeholder } from "tns-core-modules/ui/placeholder";
import { ContentView } from "tns-core-modules/ui/content-view";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import {
    CommentNode,
    InvisibleNode,
    NgView,
    TextNode,
    ViewExtensions,
    getViewClass,
    getViewMeta,
    isDetachedElement,
    isInvisibleNode,
    isKnownView,
    isView,
} from "./element-registry";

import { platformNames, Device } from "tns-core-modules/platform";
import { viewUtilLog as traceLog } from "./trace";

const ELEMENT_NODE_TYPE = 1;
const XML_ATTRIBUTES = Object.freeze(["style", "rows", "columns", "fontAttributes"]);
const whiteSpaceSplitter = /\s+/;

export type ViewExtensions = ViewExtensions;
export type NgView = NgView;
export type NgLayoutBase = LayoutBase & ViewExtensions;
export type NgContentView = ContentView & ViewExtensions;
export type NgPlaceholder = Placeholder & ViewExtensions;
export type BeforeAttachAction = (view: View) => void;

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

    public insertChild(
        parent: View,
        child: View,
        previous?: NgView,
        next?: NgView
    ) {
        if (!parent) {
            return;
        }

        const extendedParent = this.ensureNgViewExtensions(parent);
        const extendedChild = this.ensureNgViewExtensions(child);

        if (!previous) {
            previous = extendedParent.lastChild;
        }
        this.addToQueue(extendedParent, extendedChild, previous, next);

        if (isInvisibleNode(child)) {
            extendedChild.parentNode = extendedParent;
        }

        if (!isDetachedElement(child)) {
            const nextVisual = this.findNextVisual(next);
            this.addToVisualTree(extendedParent, extendedChild, nextVisual);
        }
    }

    private addToQueue(
        parent: NgView,
        child: NgView,
        previous: NgView,
        next: NgView
    ): void {
        traceLog(`ViewUtil.addToQueue parent: ${parent}, view: ${child}, ` +
            `previous: ${previous}, next: ${next}`);

        if (previous) {
            previous.nextSibling = child;
        } else {
            parent.firstChild = child;
        }

        if (next) {
            child.nextSibling = next;
        } else {
            this.appendToQueue(parent, child);
        }
    }

    private appendToQueue(parent: NgView, view: NgView) {
        traceLog(`ViewUtil.appendToQueue parent: ${parent} view: ${view}`);

        if (parent.lastChild) {
            parent.lastChild.nextSibling = view;
        }

        parent.lastChild = view;
    }

    private addToVisualTree(parent: NgView, child: NgView, next: NgView): void {
        traceLog(`ViewUtil.addToVisualTree parent: ${parent}, view: ${child}, next: ${next}`);

        if (parent.meta && parent.meta.insertChild) {
            parent.meta.insertChild(parent, child, next);
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

        const nextVisual = this.findNextVisual(next);
        if (nextVisual) {
            const index = parent.getChildIndex(nextVisual);
            parent.insertChild(child, index);
        } else {
            parent.addChild(child);
        }
    }

    private findNextVisual(view: NgView): NgView {
        let next = view;
        while (next && isDetachedElement(next)) {
            next = next.nextSibling;
        }

        return next;
    }

    public removeChild(parent: View, child: View) {
       traceLog(`ViewUtil.removeChild parent: ${parent} child: ${child}`);

        if (!parent) {
            return;
        }

        const extendedParent = this.ensureNgViewExtensions(parent);
        const extendedChild = this.ensureNgViewExtensions(child);

        this.removeFromQueue(extendedParent, extendedChild);
        this.removeFromVisualTree(extendedParent, extendedChild);
    }

    private removeFromQueue(parent: NgView, child: NgView) {
        traceLog(`ViewUtil.removeFromQueue parent: ${parent} child: ${child}`);

        if (parent.firstChild === child && parent.lastChild === child) {
            parent.firstChild = null;
            parent.lastChild = null;
            return;
        }

        if (parent.firstChild === child) {
            parent.firstChild = child.nextSibling;
        }

        const previous = this.findPreviousElement(parent, child);
        if (parent.lastChild === child) {
            parent.lastChild = previous;
        }

        if (previous) {
            previous.nextSibling = child.nextSibling;
        }
    }

    // NOTE: This one is O(n) - use carefully
    private findPreviousElement(parent: NgView, child: NgView): NgView {
        traceLog(`ViewUtil.findPreviousElement parent: ${parent} child: ${child}`);

        let previousVisual;
        if (isLayout(parent)) {
            previousVisual = this.getPreviousVisualElement(parent, child);
        }

        let previous = previousVisual || parent.firstChild;

        // since detached elements are not added to the visual tree,
        // we need to find the actual previous sibling of the view,
        // which may as well be an invisible node
        while (previous && previous !== child && previous.nextSibling !== child) {
            previous = previous.nextSibling;
        }

        return previous;
    }

    private getPreviousVisualElement(parent: NgLayoutBase, child: NgView): NgView {
        const elementIndex = parent.getChildIndex(child);

        if (elementIndex > 0) {
            return parent.getChildAt(elementIndex - 1) as NgView;
        }
    }

    // NOTE: This one is O(n) - use carefully
    public getChildIndex(parent: any, child: NgView) {
        if (isLayout(parent)) {
            return parent.getChildIndex(child);
        } else if (isContentView(parent)) {
            return child === parent.content ? 0 : -1;
        }
    }

    private removeFromVisualTree(parent: NgView, child: NgView) {
        traceLog(`ViewUtil.findPreviousElement parent: ${parent} child: ${child}`);

        if (parent.meta && parent.meta.removeChild) {
            parent.meta.removeChild(parent, child);
        } else if (isLayout(parent)) {
            this.removeLayoutChild(parent, child);
        } else if (isContentView(parent) && parent.content === child) {
            parent.content = null;
            parent.lastChild = null;
            parent.firstChild = null;
        } else if (isView(parent)) {
            parent._removeView(child);
        }
    }

    private removeLayoutChild(parent: NgLayoutBase, child: NgView): void {
        const index = parent.getChildIndex(child);

        if (index !== -1) {
            parent.removeChild(child);
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
        const view = <NgView>new viewClass();
        const ngView = this.setNgViewExtensions(view, name);

        return ngView;
    }

    private ensureNgViewExtensions(view: View): NgView {
        if (view.hasOwnProperty("meta")) {
            return view as NgView;
        } else {
            const name = view.cssType;
            const ngView = this.setNgViewExtensions(view, name);

            return ngView;
        }
    }

    private setNgViewExtensions(view: View, name: string): NgView {
        const ngView = view as NgView;
        ngView.nodeName = name;
        ngView.meta = getViewMeta(name);

        // we're setting the node type of the view
        // to 'element' because of checks done in the
        // dom animation engine
        ngView.nodeType = ELEMENT_NODE_TYPE;

        return ngView;
    }

    public setProperty(view: NgView, attributeName: string, value: any, namespace?: string): void {
        if (!view || (namespace && !this.runsIn(namespace))) {
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
