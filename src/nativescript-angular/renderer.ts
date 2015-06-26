import {View} from 'ui/core/view';
import {Injectable} from 'angular2/angular2';
import {MapWrapper} from 'angular2/src/facade/collection';
import {DomProtoView, resolveInternalDomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {Renderer, RenderProtoViewRef, RenderViewRef, EventDispatcher} from 'angular2/src/render/api';
import {NG_BINDING_CLASS} from 'angular2/src/render/dom/util';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {topmost} from 'ui/frame';

import {Button} from 'ui/button';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Label} from 'ui/label';
import {TextField} from 'ui/text-field';

export class NativeScriptView {
    constructor(public proto: DomProtoView,
        public rootChildElements,
        public boundElements: Array<ViewNode>,
        public boundTextNodes) {
    }
}

export class NativeScriptViewRef extends RenderViewRef {
  _view: NativeScriptView;
  constructor(view: NativeScriptView) {
    super();
    this._view = view;
  }

  resolveView(): NativeScriptView {
    return this._view;
  }
}

interface ViewClass {
    new(): View
}

export class ViewNode {
    //TODO: move element registration and imports to a new module
    private static allowedElements: Map<string, ViewClass> = new Map<string, ViewClass>([
        ["button", Button],
        ["stacklayout", StackLayout],
        ["textfield", TextField],
        ["label", Label]
    ]);

	private ui: View;
	private _parentView: View;
    private _attachedToView: boolean = false;

	public children:Array<ViewNode> = [];

	constructor(public parentNode: ViewNode,
                public viewName: string,
                public attributes: Object = {}) {

        console.log('ViewNode: ' + viewName + ' ' + (this.parentNode ? this.parentNode.viewName : 'TOP') +
            ' @ ' + this.attributes);
        if (this.parentNode)
            this.parentNode.children.push(this);
    }

    get parentView(): View {
        if (this._parentView)
            return this._parentView

        if (this.parentNode) {
            if(this.parentNode.ui) {
                this._parentView = this.parentNode.ui;
            } else {
                this._parentView = this.parentNode.parentView;
            }
        }
        if (!this._parentView) {
            this._parentView = topmost().currentPage;
        }
        return this._parentView;
    }

    public attachToView() {
        console.log('ViewNode.attachToView ' + this.viewName);
        this._attachedToView = true;

        this.createUI();

        this.children.forEach(child => {
            child.attachToView();
        });
    }

    private createUI() {
        if (!ViewNode.allowedElements.has(this.viewName))
            return;

        console.log('createUI: ' + this.viewName + ', parent: ' + this.parentNode.viewName);

        let uiClass = ViewNode.allowedElements.get(this.viewName);
        this.ui = new uiClass();

        this.configureUI();

        if ((<any>this.parentView)._addChildFromBuilder) {
            (<any>this.parentView)._addChildFromBuilder(this.viewName, this.ui);
        } else {
            throw new Error("Parent view can't have children! " + this._parentView);
        }
    }

    private configureUI() {
        if (!this.attributes)
            return;

        //parse5 lowercases attribute names, so we need to find the actual property name
        var propMap = {};
        for (var propName in this.ui) {
            propMap[propName.toLowerCase()] = propName;
        }

        for (var attribute in this.attributes) {
            let propertyName = attribute;
            let propertyValue = this.attributes[attribute];

            if (propMap[attribute]) {
                propertyName = propMap[attribute];
            }

            this.ui[propertyName] = propertyValue;
        }
    }

    public insertChildAt(index: number, childNode: ViewNode) {
        this.children[index] = childNode;
        childNode.parentNode = this;

        if (this._attachedToView)
            childNode.attachToView();
    }

    setProperty(name: string, value: any) {
        console.log(this.viewName + ' setProperty ' + name + ' ' + value);
        //this.ui._setValue(name, value);
        if (this.ui) {
            //var page = topmost().currentPage;
            //var button = <Button> page.content;
            //(<Button>this.ui).text = value;
            console.log('actual setProperty ');
            this.ui[name] = value;
        }
    }
}

@Injectable()
export class NativeScriptRenderer extends Renderer {
    constructor() {
        console.log('NativeScriptRenderer created');
        super();
    }

	createRootHostView(hostProtoViewRef: RenderProtoViewRef): RenderViewRef {
		console.log("NativeScriptRenderer.createRootHostView");
		var hostProtoView = resolveInternalDomProtoView(hostProtoViewRef);
		return new NativeScriptViewRef(this._createView(hostProtoView, true));
	}

	detachFreeHostView(parentHostViewRef: RenderViewRef, hostViewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.detachFreeHostView");
	}

	createView(protoViewRef: RenderProtoViewRef): RenderViewRef {
		console.log("NativeScriptRenderer.createView");
		var protoView = resolveInternalDomProtoView(protoViewRef);
		return new NativeScriptViewRef(this._createView(protoView, false));
	}

	destroyView(viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.destroyView");
		// DomRenderer had "noop for now", so, uh...
		// noop for now
	}

	attachComponentView(hostViewRef: RenderViewRef, elementIndex: number,
            componentViewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.attachComponentView");
        var hostView = (<NativeScriptViewRef>hostViewRef).resolveView();
        var parent = hostView.boundElements[elementIndex];
        var componentView = (<NativeScriptViewRef>componentViewRef).resolveView();
        componentView.rootChildElements.forEach((child, index) => {
            parent.insertChildAt(index, child);
        });
	}

	detachComponentView(hostViewRef: RenderViewRef, boundElementIndex: number, componentViewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.detachComponentView ");
	}

	attachViewInContainer(parentViewRef: RenderViewRef, boundElementIndex: number, atIndex: number, viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.attachViewInContainer ");
	}

	detachViewInContainer(parentViewRef: RenderViewRef, boundElementIndex: number, atIndex: number, viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.detachViewInContainer ");
	}

	hydrateView(viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.hydrateView ");
	}

	dehydrateView(viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.dehydrateView");
	}

	setElementProperty(viewRef: RenderViewRef, elementIndex: number, propertyName: string, propertyValue: any) {
		console.log("NativeScriptRenderer.setElementProperty " + propertyName + " = " + propertyValue);

        var view = (<NativeScriptViewRef>viewRef).resolveView();
        var element = view.boundElements[elementIndex];
        element.setProperty(propertyName, propertyValue);
	}

	callAction(viewRef: RenderViewRef, elementIndex: number, actionExpression: string, actionArgs: any) {
		console.log("NativeScriptRenderer.callAction ");
	}

	setText(viewRef: RenderViewRef, textNodeIndex: number, text: string) {
		console.log("NativeScriptRenderer.setText ");
	}

	setEventDispatcher(viewRef: RenderViewRef, dispatcher: EventDispatcher) {
		console.log("NativeScriptRenderer.setEventDispatcher ");
	}

	_createView(proto: DomProtoView, isRoot = false): NativeScriptView {
		console.log("NativeScriptRenderer._createView ");

		var nativeElements: Array<ViewNode>;
		var boundElements: Array<ViewNode> = [];
		if (proto.rootBindingOffset == 0) {
			nativeElements = this._createNodes(null, proto.element.children[0].children, boundElements);
		} else {
			nativeElements = this._createNodes(null, [proto.element], boundElements);
		}

		if (isRoot) {
			nativeElements[0].attachToView();
		}
		var boundTextNodes = this._createBoundTextNodes(proto, boundElements);
		var view = new NativeScriptView(proto, nativeElements, boundElements, boundTextNodes);

		return view;
	}

	_createNodes(parent: ViewNode, parsedChildren, boundElements: Array<ViewNode>): Array<ViewNode> {
        console.log('NativeScriptRenderer._createNodes ' + (parent ? parent.viewName : 'NULL'));
		var viewNodes = [];
        parsedChildren.forEach(node => {
			var viewNode: ViewNode;
			if (node.type == "tag") {
				viewNode = new ViewNode(parent, node.name, node.attribs);
			} else if (node.type == "text") {
				viewNode = new ViewNode(parent, "rawtext", new Map<string, string>([["text", node.data]]));
			}

			if (DOM.hasClass(node, NG_BINDING_CLASS)) {
				boundElements.push(viewNode);
			}

			if (node.children) {
				var children = this._createNodes(viewNode, node.children, boundElements);
                children.forEach((childViewNode, index) => {
					viewNode.insertChildAt(index, childViewNode);
				});
			}
			viewNodes.push(viewNode)
		});
		return viewNodes;
	}

	_createBoundTextNodes(proto: DomProtoView, boundElements: Array<ViewNode>) {
		var boundTextNodes = [];
		var elementBinders = proto.elementBinders;
		for (var i = 0; i < elementBinders.length; i++) {
			var indicies = elementBinders[i].textNodeIndices;
			var nativeNodes = boundElements[i].children;
			for (var j = 0; j < indicies.length; j++) {
				var index = indicies[j];
				boundTextNodes.push(nativeNodes[index]);
			}
		}
		return boundTextNodes;
	}
}
