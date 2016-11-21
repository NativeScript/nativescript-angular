import {isString, isDefined} from "utils/types";
import {View} from "ui/core/view";
import {Placeholder} from "ui/placeholder";
import {ContentView} from 'ui/content-view';
import {LayoutBase} from 'ui/layouts/layout-base';
import {ViewClass, getViewClass, getViewMeta, isKnownView, ViewExtensions, NgView} from './element-registry';
import {getSpecialPropertySetter} from "ui/builder/special-properties";
import {StyleProperty, getPropertyByName, withStyleProperty} from "ui/styling/style-property";
import {ValueSource} from "ui/core/dependency-observable";
import {platformNames, Device} from "platform";
import {rendererLog as traceLog, styleError} from "./trace";

const IOS_PREFX: string = ":ios:";
const ANDROID_PREFX: string = ":android:";
const whiteSpaceSplitter = /\s+/;

export type ViewExtensions = ViewExtensions;
export type NgView = NgView;
export type NgLayoutBase = LayoutBase & ViewExtensions;
export type NgContentView = ContentView & ViewExtensions;
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

    public insertChild(parent: any, child: NgView, atIndex = -1) {
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
            parent.content = child;
        } else if (parent && parent._addChildFromBuilder) {
            parent._addChildFromBuilder(child.nodeName, child);
        } else {
            //throw new Error("Parent can't contain children: " + parent.nodeName + ', ' + parent);
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
        } else if (isView(parent)) {
            parent._removeView(child);
        } else {
            //throw new Error('Unknown parent type: ' + parent);
        }
    }

    public getChildIndex(parent: any, child: NgView) {
        if (isLayout(parent)) {
            return parent.getChildIndex(child);
        } else if (isContentView(parent)) {
            return child === parent.content ? 0 : -1;
        } else {
            //throw new Error("Parent can't contain children: " + parent);
        }
    }

    private createAndAttach(name: string, viewClass: ViewClass, parent: NgView, beforeAttach?: BeforeAttachAction): NgView {
        const view = <NgView>new viewClass();
        view.nodeName = name;
        view.meta = getViewMeta(name);
        if (beforeAttach) {
            beforeAttach(view);
        }
        if (parent) {
            this.insertChild(parent, view);
        }
        return view;
    }

    public createView(name: string, parent: NgView, beforeAttach?: BeforeAttachAction): NgView {
        if (isKnownView(name)) {
            const viewClass = getViewClass(name);
            return this.createAndAttach(name, viewClass, parent, beforeAttach);
        } else {
            return this.createViewContainer(parent, beforeAttach);
        }
    }

    public createText(): NgView {
        const text = <NgView>new Placeholder();
        text.nodeName = "#text";
        text.visibility = "collapse";
        text.meta = getViewMeta("Placeholder");
        return text;
    }

    public createViewContainer(parentElement: NgView, beforeAttach: BeforeAttachAction) {
        traceLog('Creating view container in:' + parentElement);

        const layout = this.createView('ProxyViewContainer', parentElement, beforeAttach);
        layout.nodeName = 'ProxyViewContainer';
        return layout;
    }

    public createTemplateAnchor(parentElement: NgView) {
        //HACK: Using a ContentView here, so that it creates a native View object
        const anchor = this.createAndAttach('template', ContentView, parentElement);
        anchor.visibility = "collapse";
        anchor.templateParent = parentElement;
        return anchor;
    }

    private isXMLAttribute(name: string): boolean {
        switch (name) {
            case "style": return true;
            case "rows": return true;
            case "columns": return true;
            case "fontAttributes": return true;
            default: return false;
        }
    }

    private platformFilter(attribute: string): string {
        let lowered = attribute.toLowerCase();
        if (lowered.indexOf(IOS_PREFX) === 0) {
            if (this.isIos) {
                return attribute.substr(IOS_PREFX.length);
            } else {
                return null;
            }
        }

        if (lowered.indexOf(ANDROID_PREFX) === 0) {
            if (this.isAndroid) {
                return attribute.substr(ANDROID_PREFX.length);
            } else {
                return null;
            }
        }

        return attribute;
    }

    public setProperty(view: NgView, attributeName: string, value: any): void {
        attributeName = this.platformFilter(attributeName);
        if (!attributeName) {
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

    private setPropertyInternal(view: NgView, attributeName: string, value: any): void {
        traceLog('Setting attribute: ' + attributeName);

        let specialSetter = getSpecialPropertySetter(attributeName);
        let propMap = this.getProperties(view);

        if (attributeName === "class") {
            this.setClasses(view, value);
        } else if (this.isXMLAttribute(attributeName)) {
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
            for (let propName in instance) {
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
        let classValue = (<any>Array).from(this.cssClasses(view).keys()).join(' ');
        view.cssClass = classValue;
    }

    private resolveCssValue(styleValue: string): string {
        return styleValue;
    }

    private setStyleValue(view: NgView, property: StyleProperty, value: any) {
        try {
            if (value === null) {
                view.style._resetValue(property, ValueSource.Local);
            }
            else {
                view.style._setValue(property, value, ValueSource.Local);
            }
        } catch (ex) {
            styleError("Error setting property: " + property.name + " view: " + view + " value: " + value + " " + ex);
        }
    }

    public setStyleProperty(view: NgView, styleName: string, styleValue: string): void {
        traceLog("setStyleProperty: " + styleName + " = " + styleValue);

        let name = styleName;
        let resolvedValue = this.resolveCssValue(styleValue);
        withStyleProperty(name, resolvedValue, (property, value) => {
            if (isString(property)) {
                //Fall back to resolving property by name.
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
}
