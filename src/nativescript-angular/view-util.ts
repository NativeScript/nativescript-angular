import {isString, isDefined} from "utils/types";
import {View} from "ui/core/view";
import {Placeholder} from "ui/placeholder";
import {ContentView} from 'ui/content-view';
import {LayoutBase} from 'ui/layouts/layout-base';
import {ViewClass, getViewClass, getViewMeta, isKnownView, ViewExtensions, NgView, ViewClassMeta} from './element-registry';
import {getSpecialPropertySetter} from "ui/builder/special-properties";
import { ActionBar, ActionItem, NavigationButton } from "ui/action-bar";
import trace = require("trace");


export const rendererTraceCategory = "ns-renderer";
export function traceLog(msg) {
    trace.write(msg, rendererTraceCategory);
}

export type ViewExtensions = ViewExtensions;
export type NgView = NgView;

export type NgLayoutBase = LayoutBase & ViewExtensions;
export type NgContentView = ContentView & ViewExtensions;

export function isView(view: any): view is NgView {
    return view instanceof View;
}

export function isLayout(view: any): view is NgLayoutBase {
    return view instanceof LayoutBase;
}

export function isContentView(view: any): view is NgContentView {
    return view instanceof ContentView;
}

export function insertChild(parent: any, child: NgView, atIndex = -1) {
    if (!parent || child.meta.skipAddToDom) {
        return;
    }

    if (parent.meta && parent.meta.insertChild) {
        parent.meta.insertChild(parent, child, atIndex);
    } else if (isLayout(parent)) {
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

export function removeChild(parent: any, child: NgView) {
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

export function getChildIndex(parent: any, child: NgView) {
    if (isLayout(parent)) {
        return parent.getChildIndex(child);
    } else if (isContentView(parent)) {
        return child === parent.content ? 0 : -1;
    } else {
        //throw new Error("Parent can't contain children: " + parent);
    }
}

function createAndAttach(name: string, viewClass: ViewClass, parent: NgView, beforeAttach?: BeforeAttachAction): NgView {
    const view = <NgView>new viewClass();
    view.nodeName = name;
    view.meta = getViewMeta(name);
    if (beforeAttach) {
        beforeAttach(view);
    }
    if (parent) {
        insertChild(parent, view);
    }
    return view;
}

export type BeforeAttachAction = (view: View) => void;

export function createView(name: string, parent: NgView, beforeAttach?: BeforeAttachAction): NgView {
    if (isKnownView(name)) {
        const viewClass = getViewClass(name);
        return createAndAttach(name, viewClass, parent, beforeAttach);
    } else {
        return createViewContainer(name, parent, beforeAttach);
    }
}

export function createText(value: string): NgView {
    const text = <NgView>new Placeholder();
    text.nodeName = "#text";
    text.visibility = "collapse";
    text.meta = getViewMeta("Placeholder");
    return text;
}

export function createViewContainer(name: string, parentElement: NgView, beforeAttach: BeforeAttachAction) {
    traceLog('Creating view container in:' + parentElement);

    const layout = createView('ProxyViewContainer', parentElement, beforeAttach);
    layout.nodeName = 'ProxyViewContainer';
    return layout;
}

export function createTemplateAnchor(parentElement: NgView) {
    //HACK: Using a ContentView here, so that it creates a native View object
    const anchor = createAndAttach('template', ContentView, parentElement);
    anchor.visibility = "collapse";
    anchor.templateParent = parentElement;
    return anchor;
}

function isXMLAttribute(name: string): boolean {
    switch (name) {
        case "style": return true;
        case "rows": return true;
        case "columns": return true;
        case "fontAttributes": return true;
        default: return false;
    }
}

export function setProperty(view: NgView, attributeName: string, value: any): void {
    if (attributeName.indexOf(".") !== -1) {
        // Handle nested properties
        const properties = attributeName.split(".");
        attributeName = properties[properties.length - 1];

        let propMap = getProperties(view);
        let i = 0;
        while (i < properties.length - 1 && isDefined(view)) {
            var prop = properties[i];
            if (propMap.has(prop)) {
                prop = propMap.get(prop);
            }

            view = view[prop];
            propMap = getProperties(view);
            i++;
        }
    }

    if (isDefined(view)) {
        setPropertyInternal(view, attributeName, value);
    }
}

function setPropertyInternal(view: NgView, attributeName: string, value: any): void {
    traceLog('Setting attribute: ' + attributeName);

    let specialSetter = getSpecialPropertySetter(attributeName);
    let propMap = getProperties(view);

    if (attributeName === "class") {
        setClasses(view, value);
    } else if (isXMLAttribute(attributeName)) {
        view._applyXmlAttribute(attributeName, value);
    } else if (specialSetter) {
        specialSetter(view, value);
    } else if (propMap.has(attributeName)) {
        // We have a lower-upper case mapped property.
        let propertyName = propMap.get(attributeName);
        view[propertyName] = convertValue(value);
    } else {
        // Unknown attribute value -- just set it to our object as is.
        view[attributeName] = convertValue(value);
    }
}

function convertValue(value: any): any {
    if (typeof (value) !== "string" || value === "") {
        return value;
    }

    var valueAsNumber = +value;
    if (!isNaN(valueAsNumber)) {
        return valueAsNumber;
    } else if (value && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
        return value.toLowerCase() === "true" ? true : false;
    } else {
        return value;
    }
}

const propertyMaps: Map<Function, Map<string, string>> = new Map<Function, Map<string, string>>();

function getProperties(instance: any): Map<string, string> {
    let type = instance && instance.constructor;
    if (!type) {
        return new Map<string, string>();
    }

    if (!propertyMaps.has(type)) {
        var propMap = new Map<string, string>();
        for (var propName in instance) {
            propMap.set(propName.toLowerCase(), propName);
        }
        propertyMaps.set(type, propMap);
    }
    return propertyMaps.get(type);
}


function cssClasses(view: NgView) {
    if (!view.cssClasses) {
        view.cssClasses = new Map<string, boolean>();
    }
    return view.cssClasses;
}

export function addClass(view: NgView, className: string): void {
    cssClasses(view).set(className, true);
    syncClasses(view);
}

export function removeClass(view: NgView, className: string): void {
    cssClasses(view).delete(className);
    syncClasses(view);
}

const whiteSpaceSplitter = /\s+/;

function setClasses(view: NgView, classesValue: string): void {
    let classes = classesValue.split(whiteSpaceSplitter)
    classes.forEach((className) => cssClasses(view).set(className, true));
    syncClasses(view);
}

function syncClasses(view: NgView): void {
    let classValue = (<any>Array).from(cssClasses(view).keys()).join(' ');
    view.cssClass = classValue;
}


export function setStyleProperty(view: NgView, styleName: string, styleValue: string): void {
    throw new Error("Not implemented: setStyleProperty");
}
