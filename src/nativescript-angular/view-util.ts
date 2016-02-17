import {isString} from "utils/types";
import {View} from "ui/core/view";
import {Placeholder} from "ui/placeholder";
import {ContentView} from 'ui/content-view';
import {LayoutBase} from 'ui/layouts/layout-base';
import {ViewClass, getViewClass, isKnownView} from './element-registry';
import {getSpecialPropertySetter} from "ui/builder/special-properties";
import trace = require("trace");

export const rendererTraceCategory = "ns-renderer";
export function traceLog(msg) {
    trace.write(msg, rendererTraceCategory);
}

export interface ViewExtensions {
    nodeName: string;
    templateParent: NgView;
    cssClasses: Map<string, boolean>;
}

export type NgView = View & ViewExtensions;
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

function isComplexProperty(view: NgView) {
    const name = view.nodeName
    return isString(name) && name.indexOf(".") !== -1;
}

export function insertChild(parent: any, child: NgView, atIndex = -1) {
    if (isLayout(parent)) {
        if (atIndex !== -1) {
            parent.insertChild(child, atIndex);
        } else {
            parent.addChild(child);
        }
    } else if (isContentView(parent)) {
        parent.content = child;
    } else {
        //throw new Error("Parent can't contain children: " + parent.nodeName + ', ' + parent);
    }
}

export function removeChild(parent: any, child: NgView) {
    if (isLayout(parent)) {
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

function createAndAttach(name: string, viewClass: ViewClass, parent: NgView): NgView {
    const view = <NgView>new viewClass();
    view.nodeName = name;
    if (parent) {
        insertChild(parent, view);
    }
    return view;
}

export function createView(name: string, parent: NgView): NgView {
    if (isKnownView(name)) {
        const viewClass = getViewClass(name);
        return createAndAttach(name, viewClass, parent);
    } else {
        return createViewContainer(name, parent);
    }
}

export function createText(value: string): NgView {
    const text = <NgView>new Placeholder();
    text.nodeName = "#text";
    text.visibility = "collapse";
    return text;
}

export function createViewContainer(name: string, parentElement: NgView) {
    //HACK: Using a ContentView here, so that it creates a native View object
    traceLog('Creating view container in:' + parentElement);

    const layout = createView('ProxyViewContainer', parentElement);
    layout.nodeName = 'ProxyViewContainer';
    return layout;
}

export function createTemplateAnchor(parentElement: NgView) {
    //HACK: Using a ContentView here, so that it creates a native View object
    const anchor = createAndAttach('ContentView', ContentView, parentElement);
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
        view[propertyName] = value;
    } else {
        // Unknown attribute value -- just set it to our object as is.
        view[attributeName] = value;
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
