import {View} from 'ui/core/view';
import {Observable, EventData} from 'data/observable';
import {topmost} from 'ui/frame';
import {Button} from 'ui/button';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Label} from 'ui/label';
import {TextField} from 'ui/text-field';
import {TextView} from 'ui/text-view';
import {Layout} from 'ui/layouts/layout';
import {NativeScriptView} from 'nativescript-angular/renderer';
import {AST} from 'angular2/src/change_detection/parser/ast';

interface ViewClass {
    new(): View
}

type EventHandler = (args: EventData) => void;

export class ViewNode {
    //TODO: move element registration and imports to a new module
    private static allowedElements: Map<string, ViewClass> = new Map<string, ViewClass>([
        ["button", Button],
        ["stacklayout", StackLayout],
        ["textfield", TextField],
        ["textview", TextView],
        ["label", Label]
    ]);

    private eventListeners: Map<string, EventHandler> = new Map<string, EventHandler>();

    public nativeView: View;
    private _parentView: View;
    private _attachedToView: boolean = false;

    public children:Array<ViewNode> = [];

    constructor(public parentNode: ViewNode,
                public viewName: string,
                public attributes: Object = {}) {
        if (this.parentNode)
            this.parentNode.children.push(this);
    }

    print(depth: number = 0) {
        let line = "";

        for (let i = 0; i < depth; i++)
            line += "    "

        console.log(line + this.viewName + '(' + this._attachedToView + ') ' + (this.nativeView != null ? (<any>this.nativeView).__id : 'NULL'));

        this.children.forEach(child => {
            child.print(depth + 1);
        });
    }

    printTree() {
        let root = this;
        while (root.parentNode !== null) {
            root = root.parentNode;
        }
        root.print();
    }

    get parentNativeView(): View {
        if (this._parentView)
            return this._parentView

        if (this.parentNode) {
            if(this.parentNode.nativeView) {
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

    public attachToView(atIndex: number = -1) {
        console.log('ViewNode.attachToView ' + this.viewName);
        if (this._attachedToView) {
            console.log('already attached.');
            return;
        }

        this._attachedToView = true;

        this.createUI(atIndex);

        this.children.forEach(child => {
            child.attachToView();
        });
    }

    private createUI(attachAtIndex: number) {
        if (!ViewNode.allowedElements.has(this.viewName))
            return;

        console.log('createUI: ' + this.viewName +
            ', attachAt: ' + attachAtIndex +
            ', parent: ' + this.parentNode.viewName +
            ', parent UI ' + (<any>this.parentNativeView.constructor).name);

        let viewClass = ViewNode.allowedElements.get(this.viewName);
        if (!this.nativeView) {
            this.nativeView = new viewClass();
        } else {
            console.log('Reattaching old view: ' + this.viewName);
        }

        this.configureUI();

        if (this.parentNativeView instanceof Layout) {
            let parentLayout = <Layout>this.parentNativeView;
            if (attachAtIndex != -1) {
                console.log('Layout.insertChild');
                parentLayout.insertChild(attachAtIndex, this.nativeView);
            } else {
                console.log('Layout.addChild');
                parentLayout.addChild(this.nativeView);
            }
            this.attachUIEvents();
        } else if ((<any>this.parentNativeView)._addChildFromBuilder) {
            console.log('_addChildFromBuilder ' + (<any>this.parentNativeView)._addChildFromBuilder);
            (<any>this.parentNativeView)._addChildFromBuilder(this.viewName, this.nativeView);
            this.attachUIEvents();
        } else {
            throw new Error("Parent view can't have children! " + this._parentView);
        }
    }

    private configureUI() {
        if (!this.attributes)
            return;

        //parse5 lowercases attribute names, so we need to find the actual property name
        var propMap = {};
        for (var propName in this.nativeView) {
            propMap[propName.toLowerCase()] = propName;
        }

        for (var attribute in this.attributes) {
            let propertyName = attribute;
            let propertyValue = this.attributes[attribute];

            if (propMap[attribute]) {
                propertyName = propMap[attribute];
            }

            console.log('Set attribute: ' + propertyName + ' = ' + propertyValue);
            this.nativeView[propertyName] = propertyValue;
        }
    }

    private attachUIEvents() {
        this.eventListeners.forEach((callback, eventName) => {
            console.log('Attaching event listener for: ' + eventName);
            this.nativeView.addEventListener(eventName, callback);
        });
    }

    public insertChildAt(index: number, childNode: ViewNode) {
        console.log('ViewNode.insertChildAt: ' + this.viewName + ' ' + index + ' ' + childNode.viewName);
        if (childNode.parentNode) {
            console.log('Moving child to new parent');
            childNode.parentNode.removeChild(childNode);
        }
        this.children.splice(index, 0, childNode);
        childNode.parentNode = this;
    }

    public removeChild(childNode: ViewNode) {
        childNode.parentNode = null;
        childNode._parentView = null;
        childNode._attachedToView = false;
        this.children = this.children.filter((item) => item !== childNode);

        if (childNode.nativeView && this.parentNativeView) {
            if (this.parentNativeView instanceof Layout) {
                console.log('native removeChild ' + childNode.viewName);
                (<Layout>this.parentNativeView).removeChild(childNode.nativeView);
            } else {
                console.log('native _removeView ' + childNode.viewName);
                this.parentNativeView._removeView(childNode.nativeView);
            }
        }
    }

    setProperty(name: string, value: any) {
        console.log('ViewNode.setProperty ' + this.viewName + ' setProperty ' + name + ' ' + value);
        if (this.nativeView) {
            this.nativeView[name] = value;
        } else {
            console.log('setProperty called without a nativeView');
        }
    }

    createEventListener(view: NativeScriptView, bindingIndex: number, eventName: string, eventLocals: AST) {
        console.log('createEventListener ' + this.viewName + ' ' + eventName + ' ' + eventLocals);

        let handler = (args: EventData) => {
            var locals = new Map<string, any>();
            locals.set('$event', args);
            //TODO: remove -- used for debug prints triggered from outside the renderer code.
            locals.set('$el', this);
            view.eventDispatcher.dispatchEvent(bindingIndex, eventName, locals);
        }
        let zonedHandler = global.zone.bind(handler);
        this.eventListeners.set(eventName, zonedHandler);
    }
}
