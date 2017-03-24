import { isString, isDefined } from "utils/types";
import { View } from "ui/core/view";
import { Placeholder } from "ui/placeholder";
import { ContentView } from "ui/content-view";
import { LayoutBase } from "ui/layouts/layout-base";
import {
    getViewClass,
    getViewMeta,
    isKnownView,
    ViewExtensions,
    NgView,
} from "./element-registry";
import { getSpecialPropertySetter } from "ui/builder/special-properties";
import { StyleProperty, getPropertyByName, withStyleProperty } from "ui/styling/style-property";
import { ValueSource } from "ui/core/dependency-observable";
import { platformNames, Device } from "platform";
import { rendererLog as traceLog, styleError } from "./trace";

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

    public insertChild(parent: any, child: NgView, atIndex: number = -1) {
        if (!parent || child.meta.skipAddToDom) {
            return;
        }

        if (parent.meta && parent.meta.insertChild) {
            parent.meta.insertChild(parent, child, atIndex);
        } else if (isLayout(parent)) {
            if (child.parent === parent) {
                let index = (<LayoutBase>parent).getChildIndex(child);
                if (index !== -1) {
                    parent.removeChild(child);
                }
            }
            if (atIndex !== -1) {
                parent.insertChild(child, atIndex);
            } else {
                parent.addChild(child);
            }
        } else if (isContentView(parent)) {
            // Explicit handling of template anchors inside ContentView
            if (child.nodeName === "#comment") {
                parent._addView(child, atIndex);
            } else {
                parent.content = child;
            }
        } else if (parent && parent._addChildFromBuilder) {
            parent._addChildFromBuilder(child.nodeName, child);
        } else {
            // throw new Error("Parent can"t contain children: " + parent.nodeName + ", " + parent);
        }
    }

    public removeChild(parent: any, child: NgView) {
        if (!parent || child.meta.skipAddToDom) {
            return;
        }

        if (parent.meta && parent.meta.removeChild) {
            parent.meta.removeChild(parent, child);
        } else if (isLayout(parent)) {
            parent.removeChild(child);
        } else if (isContentView(parent)) {
            if (parent.content === child) {
                parent.content = null;
            }

            // Explicit handling of template anchors inside ContentView
            if (child.nodeName === "#comment") {
                parent._removeView(child);
            }
        } else if (isView(parent)) {
            parent._removeView(child);
        } else {
            // throw new Error("Unknown parent type: " + parent);
        }
    }

    public getChildIndex(parent: any, child: NgView) {
        if (isLayout(parent)) {
            return parent.getChildIndex(child);
        } else if (isContentView(parent)) {
            return child === parent.content ? 0 : -1;
        } else {
            // throw new Error("Parent can"t contain children: " + parent);
        }
    }

    public createComment(): NgView {
        const commentView = this.createView("Comment");
        commentView.nodeName = "#comment";
        commentView.visibility = "collapse";

        return commentView;
    }

    public createText(): NgView {
        const detachedText = this.createView("DetachedText");
        detachedText.nodeName = "#text";
        detachedText.visibility = "collapse";

        return detachedText;
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
    public nextSiblingIndex(node: NgView): number {
        const parent = node.parent;
        if (!parent) {
            return -1;
        }

        let index = 0;
        let found = false;

        (<any>parent)._eachChildView(child => {
            if (child === node) {
                found = true;
            }

            index += 1;
            return !found;
        });

        return found ? index : -1;
    }

    private runsIn(platform: string): boolean {
        return (platform === "ios" && this.isIos) ||
            (platform === "android" && this.isAndroid);
    }


    private setPropertyInternal(view: NgView, attributeName: string, value: any): void {
        traceLog("Setting attribute: " + attributeName);

        let specialSetter = getSpecialPropertySetter(attributeName);
        let propMap = this.getProperties(view);

        if (attributeName === "class") {
            this.setClasses(view, value);
        } else if (XML_ATTRIBUTES.indexOf(attributeName) !== -1) {
            view._applyXmlAttribute(attributeName, value);
        } else if (specialSetter) {
            specialSetter(view, value);
        } else if (propMap.has(attributeName)) {
            // We have a lower-upper case mapped property.
            let propertyName = propMap.get(attributeName);
            view[propertyName] = this.convertValue(value);
        } else {
            // Unknown attribute value -- just set it to our object as is.
            view[attributeName] = this.convertValue(value);
        }
    }

    private convertValue(value: any): any {
        if (typeof (value) !== "string" || value === "") {
            return value;
        }

        let valueAsNumber = +value;
        if (!isNaN(valueAsNumber)) {
            return valueAsNumber;
        } else if (value && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
            return value.toLowerCase() === "true" ? true : false;
        } else {
            return value;
        }
    }

    private getProperties(instance: any): Map<string, string> {
        let type = instance && instance.constructor;
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
        view.cssClass = classValue;
    }

   public setStyle(view: NgView, styleName: string, value: any) {
        traceLog(`Set style: ${styleName} with value: ${value} to view: ${view}`);
        this.setStyleProperty(view, styleName, value);
    }

    public removeStyle(view: NgView, styleName: string) {
        traceLog(`Remove style: ${styleName} from view: ${view}`);
        this.setStyleProperty(view, styleName);
    }

    private setStyleProperty(view: NgView, styleName: string, styleValue?: string): void {
        traceLog("setStyleProperty: " + styleName + " = " + styleValue);

        let name = styleName;
        let resolvedValue = this.resolveCssValue(styleValue);
        withStyleProperty(name, resolvedValue, (property, value) => {
            if (isString(property)) {
                // Fall back to resolving property by name.
                const resolvedProperty = getPropertyByName(name);
                if (resolvedProperty) {
                    this.setStyleValue(view, resolvedProperty, resolvedValue);
                } else {
                    traceLog("Unknown style property: " + styleName);
                }
            } else {
                const resolvedProperty = <StyleProperty>property;
                this.setStyleValue(view, resolvedProperty, value);
            }

        });
    }

    private resolveCssValue(styleValue: string): string {
        return styleValue;
    }

    private setStyleValue(view: NgView, property: StyleProperty, value: any) {
        try {
            if (!!value) {
                view.style._setValue(property, value, ValueSource.Local);
            } else {
                view.style._resetValue(property, ValueSource.Local);
            }
        } catch (ex) {
            styleError("Error setting property: " + property.name + " view: " + view +
                " value: " + value + " " + ex);
        }
    }
}

