import {View} from 'ui/core/view';
import {ContentView} from 'ui/content-view';
import {Observable, EventData} from 'data/observable';
import {getSpecialPropertySetter} from "ui/builder/special-properties";
import {topmost} from 'ui/frame';
import {Button} from 'ui/button';
import {StackLayout} from 'ui/layouts/stack-layout';
import {DockLayout} from 'ui/layouts/dock-layout';
import {Label} from 'ui/label';
import {TextField} from 'ui/text-field';
import {TextView} from 'ui/text-view';
import {Switch} from 'ui/switch';
import {LayoutBase} from 'ui/layouts/layout-base';
import gestures = require("ui/gestures");
import {ViewClass, getViewClass, isKnownView} from './element-registry';
import {isString} from "utils/types";

type EventHandler = (args: EventData) => void;

//var console = {log: function(msg) {}}

export class ViewNode {
    private eventListeners: Map<string, EventHandler> = new Map<string, EventHandler>();

    public nativeView: View;
    private _parentView: View;
    private _attachedToView: boolean = false;
    private attributes: Map<string, any> = new Map<string, any>();
    private cssClasses: Map<string, boolean> = new Map<string, boolean>();
    private static whiteSpaceSplitter = /\s+/;

    public children: Array<ViewNode> = [];

    constructor(public parentNode: ViewNode,
        public viewName: string,
        attrNameAndValues: string[]) {
        this.setAttributeValues(attrNameAndValues);

        if (this.parentNode)
            this.parentNode.children.push(this);
    }

    print(depth: number = 0) {
        let line = "";

        for (let i = 0; i < depth; i++)
            line += "    "

        console.log(line + this.viewName + '(' + this._attachedToView + ') ');

        this.children.forEach(child => {
            child.print(depth + 1);
        });
    }

    get parentNativeView(): View {
        if (this._parentView)
            return this._parentView

        if (this.parentNode) {
            if (this.parentNode.viewName !== "template" && this.parentNode.nativeView) {
                this._parentView = this.parentNode.nativeView;
            } else {
                this._parentView = this.parentNode.parentNativeView;
            }
        }
        if (!this._parentView) {
            this._parentView = topmost().currentPage;
        }
        return this._parentView;
    }

    get isComplexProperty(): boolean {
        return ViewNode.isComplexProperty(this.viewName);
    }

    public attachToView(atIndex: number = -1) {
        console.log('ViewNode.attachToView ' + this.viewName);
        if (this._attachedToView) {
            console.log('already attached.');
            return;
        }

        this._attachedToView = true;

        this.createUI(atIndex);
        this.attachUIEvents();

        this.children.forEach(child => {
            child.attachToView();
        });

        this.postAttachUI();
    }

    private createUI(attachAtIndex: number): boolean {
        if (!isKnownView(this.viewName))
            return;

        console.log('createUI: ' + this.viewName +
            ', attachAt: ' + attachAtIndex +
            ', parent: ' + this.parentNode.viewName +
            ', parent UI ' + (<any>this.parentNativeView.constructor).name);

        let viewClass = getViewClass(this.viewName);
        if (!this.nativeView) {
            this.nativeView = new viewClass();
        } else {
            console.log('Reattaching old view: ' + this.viewName);
        }

        this.configureUI();

        if (this.parentNativeView instanceof LayoutBase) {
            let parentLayout = <LayoutBase>this.parentNativeView;
            if (attachAtIndex != -1) {
                console.log('Layout.insertChild');
                let indexOffset = 0;
                if (this.parentNode.viewName === "template") {
                    indexOffset = parentLayout.getChildIndex(this.parentNode.nativeView);
                }
                parentLayout.insertChild(this.nativeView, indexOffset + attachAtIndex);
            } else {
                parentLayout.addChild(this.nativeView);
            }
        } else if (this.parentNativeView instanceof ContentView) {
            (<ContentView>this.parentNativeView).content = this.nativeView;
        } else if ((<any>this.parentNativeView)._addChildFromBuilder) {
            (<any>this.parentNativeView)._addChildFromBuilder(this.viewName, this.nativeView);
        } else if (this.parentNode.isComplexProperty) {
            // complex property - we will deal with this in postAttachUI()            
        }
        else {
            console.log('parentNativeView: ' + this.parentNativeView);
            throw new Error("Parent view can't have children! " + this.parentNativeView);
        }
    }

    private postAttachUI() {
        if (this.isComplexProperty) {
            let nativeParent = <any>this.parentNativeView;
            if (!nativeParent) {
                return;
            }

            let propertyName = ViewNode.getComplexPropertyName(this.viewName);
            let realChildren = [];
            for (let child of this.children) {
                if (child.nativeView) {
                    realChildren.push(child.nativeView);
                }
            }
            if (realChildren.length > 0) {
                if (nativeParent._addArrayFromBuilder) {
                    nativeParent._addArrayFromBuilder(propertyName, realChildren);
                }
                else {
                    this.parentNode.setAttribute(propertyName, realChildren[0]);
                }
            }
        }
    }

    private static propertyMaps: Map<Function, Map<string, string>> = new Map<Function, Map<string, string>>();

    private static getProperties(instance: any): Map<string, string> {
        let type = instance && instance.constructor;
        if (!type) {
            return new Map<string, string>();
        }

        if (!ViewNode.propertyMaps.has(type)) {
            var propMap = new Map<string, string>();
            for (var propName in instance) {
                propMap.set(propName.toLowerCase(), propName);
            }
            ViewNode.propertyMaps.set(type, propMap);
        }
        return ViewNode.propertyMaps.get(type);
    }

    private static isComplexProperty(name: string): boolean {
        return isString(name) && name.indexOf(".") !== -1;
    }

    private static getComplexPropertyName(fullName: string): string {
        var name: string;

        if (isString(fullName)) {
            var names = fullName.split(".");
            name = names[names.length - 1];
        }

        return name;
    }

    private configureUI() {
        if (this.attributes.size == 0)
            return;

        this.attributes.forEach((value, name) => {
            this.setAttribute(name, value);
        });
        this.syncClasses();
    }

    public setAttributeValues(attrNameAndValues: string[]) {
        if (attrNameAndValues) {
            for (let i = 0; i < attrNameAndValues.length; i += 2) {
                let name = attrNameAndValues[i];
                let value = attrNameAndValues[i + 1];
                this.setAttribute(name, value);
            }
        }
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

    public setAttribute(attributeName: string, value: any): void {
        if (!this.nativeView) {
            console.log('Native view not created. Delaying attribute set: ' + attributeName);
            this.attributes.set(attributeName, value);
            return;
        }

        console.log('Setting attribute: ' + attributeName);

        let specialSetter = getSpecialPropertySetter(attributeName);
        let propMap = ViewNode.getProperties(this.nativeView);

        if (attributeName === "class") {
            this.setClasses(value);
        } else if (this.isXMLAttribute(attributeName)) {
            this.nativeView._applyXmlAttribute(attributeName, value);
        } else if (specialSetter) {
            specialSetter(this.nativeView, value);
        } else if (propMap.has(attributeName)) {
            // We have a lower-upper case mapped property.
            let propertyName = propMap.get(attributeName);
            this.nativeView[propertyName] = value;
        } else {
            // Unknown attribute value -- just set it to our object as is.
            this.nativeView[attributeName] = value;
        }
    }

    public setStyleProperty(styleName: string, styleValue: string): void {
        throw new Error("Not implemented: setStyleProperty");
    }

    private attachUIEvents() {
        if (!this.nativeView) {
            return;
        }

        console.log('ViewNode.attachUIEvents: ' + this.viewName + ' ' + this.eventListeners.size);
        this.eventListeners.forEach((callback, eventName) => {
            this.attachNativeEvent(eventName, callback);
        });
    }

    private detachUIEvents() {
        if (!this.nativeView) {
            return;
        }

        console.log('ViewNode.detachUIEvents: ' + this.viewName + ' ' + this.eventListeners.size);
        this.eventListeners.forEach((callback, eventName) => {
            this.detachNativeEvent(eventName, callback);
        });
    }

    private resolveNativeEvent(parsedEventName: string): string {
        //TODO: actually resolve the event...
        return parsedEventName;
    }

    private isGesture(eventName: string): boolean {
        return gestures.fromString(name.toLowerCase()) !== undefined;
    }

    public on(eventName, callback) {
        console.log('ViewNode.on: ' + this.viewName + ' -> ' + eventName);
        if (!this.nativeView) {
            this.eventListeners.set(eventName, callback);
        } else {
            this.attachNativeEvent(eventName, callback);
        }
    }

    private attachNativeEvent(eventName, callback) {
        console.log('attachNativeEvent ' + eventName);
        let resolvedEvent = this.resolveNativeEvent(eventName);
        this.nativeView.addEventListener(resolvedEvent, callback);
    }

    private detachNativeEvent(eventName, callback) {
        console.log('detachNativeEvent ' + eventName);
        let resolvedEvent = this.resolveNativeEvent(eventName);
        this.nativeView.removeEventListener(resolvedEvent, callback);
    }

    public appendChild(childNode: ViewNode) {
        this.insertChildAt(this.children.length, childNode);
    }

    public insertChildAt(index: number, childNode: ViewNode): void {
        console.log('ViewNode.insertChildAt: ' + this.viewName + ' ' + index + ' ' + childNode.viewName);
        if (childNode.parentNode) {
            console.log('Moving child to new parent');
            childNode.parentNode.removeChild(childNode);
        }
        this.children.splice(index, 0, childNode);
        childNode.parentNode = this;
    }

    public removeChild(childNode: ViewNode): void {
        childNode.parentNode = null;
        childNode._parentView = null;
        this.children = this.children.filter((item) => item !== childNode);

        childNode.detachFromView();
    }

    public detachFromView(): void {
        this._attachedToView = false;

        this.detachUIEvents();
        if (this.nativeView) {
            let nativeParent = this.nativeView.parent;
            if (nativeParent) {
                if (nativeParent instanceof LayoutBase) {
                    (<LayoutBase>nativeParent).removeChild(this.nativeView);
                } else if (nativeParent instanceof ContentView) {
                    (<ContentView>nativeParent).content = undefined;
                }
                else {
                    nativeParent._removeView(this.nativeView);
                }
            }
        }

        this.children.forEach((childNode) => {
            childNode.detachFromView();
        });
    }

    public clearChildren() {
        while (this.children.length > 0) {
            this.removeChild(this.children[0]);
        }
    }

    public getChildIndex(childNode: ViewNode) {
        return this.children.indexOf(childNode);
    }

    public setProperty(name: string, value: any) {
        console.log('ViewNode.setProperty ' + this.viewName + ' setProperty ' + name + ' ' + value);
        if (this.nativeView) {
            this.setAttribute(name, value);
        } else {
            console.log('setProperty called without a nativeView');
        }
    }

    public addClass(className: string): void {
        this.cssClasses.set(className, true);
        this.syncClasses();
    }

    public removeClass(className: string): void {
        this.cssClasses.delete(className);
        this.syncClasses();
    }

    public setClasses(classesValue: string): void {
        let classes = classesValue.split(ViewNode.whiteSpaceSplitter)
        classes.forEach((className) => this.cssClasses.set(className, true));
        this.syncClasses();
    }

    private syncClasses(): void {
        let classValue = (<any>Array).from(this.cssClasses.keys()).join(' ');
        if (this.nativeView && classValue) {
            this.nativeView.cssClass = classValue;
        }
    }
}

export class DummyViewNode extends ViewNode {
    constructor(public parentNode: ViewNode) {
        super(parentNode, null, []);
    }
    public attachToView(atIndex: number = -1) {
    }
    public insertChildAt(index: number, childNode: ViewNode) {
    }
    public removeChild(childNode: ViewNode) {
    }
    setProperty(name: string, value: any) {
    }
}
