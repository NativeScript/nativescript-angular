import {View} from 'ui/core/view';
import {Observable, EventData} from 'data/observable';
import {Injectable} from 'angular2/angular2';
import {MapWrapper} from 'angular2/src/facade/collection';
import {DomProtoView, resolveInternalDomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {Renderer, RenderElementRef, RenderProtoViewRef, RenderViewRef, EventDispatcher} from 'angular2/src/render/api';
import {AST} from 'angular2/src/change_detection/parser/ast';
import {NG_BINDING_CLASS} from 'angular2/src/render/dom/util';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {topmost} from 'ui/frame';

import {Button} from 'ui/button';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Label} from 'ui/label';
import {TextField} from 'ui/text-field';

export class NativeScriptView {
    public eventDispatcher: EventDispatcher;

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

type EventHandler = (args: EventData) => void;

export class ViewNode {
    //TODO: move element registration and imports to a new module
    private static allowedElements: Map<string, ViewClass> = new Map<string, ViewClass>([
        ["button", Button],
        ["stacklayout", StackLayout],
        ["textfield", TextField],
        ["label", Label]
    ]);

    private eventListeners: Map<string, EventHandler> = new Map<string, EventHandler>();

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

    private attachUIEvents() {
        this.eventListeners.forEach((callback, eventName) => {
            console.log('Attaching event listener for: ' + eventName);
            this.ui.addEventListener(eventName, callback);
        });
    }

    public insertChildAt(index: number, childNode: ViewNode) {
        this.children[index] = childNode;
        childNode.parentNode = this;

        if (this._attachedToView)
            childNode.attachToView();
    }

    setProperty(name: string, value: any) {
        console.log(this.viewName + ' setProperty ' + name + ' ' + value);
        if (this.ui) {
            console.log('actual setProperty ');
            this.ui[name] = value;
        }
    }

    createEventListener(view: NativeScriptView, bindingIndex: number, eventName: string, eventLocals: AST) {
        console.log('createEventListener ' + this.viewName + ' ' + eventName + ' ' + eventLocals);
        this.eventListeners.set(eventName, (args: EventData) => {
			var locals = new Map<string, any>();
			locals.set('$event', args);
			view.eventDispatcher.dispatchEvent(bindingIndex, eventName, locals);
        });
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

	attachComponentView(location: RenderElementRef, componentViewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.attachComponentView");
        var hostView = (<NativeScriptViewRef>location.renderView).resolveView();
        var parent = hostView.boundElements[location.boundElementIndex];
        var componentView = (<NativeScriptViewRef>componentViewRef).resolveView();
        componentView.rootChildElements.forEach((child, index) => {
            parent.insertChildAt(index, child);
        });
	}

    /**
    * Detaches a componentView into the given hostView at the given element
    */
    detachComponentView(location: RenderElementRef, componentViewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.detachComponentView ");
	}

    attachViewInContainer(location: RenderElementRef, atIndex: number, viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.attachViewInContainer ");
	}

    detachViewInContainer(location: RenderElementRef, atIndex: number, viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.detachViewInContainer ");
	}

	hydrateView(viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.hydrateView ");
	}

	dehydrateView(viewRef: RenderViewRef) {
		console.log("NativeScriptRenderer.dehydrateView");
	}

    setElementProperty(location: RenderElementRef, propertyName: string, propertyValue: any) {
		console.log("NativeScriptRenderer.setElementProperty " + propertyName + " = " + propertyValue);

        var view = (<NativeScriptViewRef>location.renderView).resolveView();
        var element = view.boundElements[location.boundElementIndex];
        element.setProperty(propertyName, propertyValue);
	}
    
    /**
    * Calls a method on an element.
    */
    invokeElementMethod(location: RenderElementRef, methodName: string, args: List<any>) {
        console.log("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    setText(viewRef: RenderViewRef, textNodeIndex: number, text: string) {
        console.log("NativeScriptRenderer.setText ");
    }

	setEventDispatcher(viewRef: RenderViewRef, dispatcher: EventDispatcher) {
		console.log("NativeScriptRenderer.setEventDispatcher ");
        var view = (<NativeScriptViewRef>viewRef).resolveView();
        view.eventDispatcher = dispatcher;
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

		var binders = proto.elementBinders;
        for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
            var binder = binders[binderIdx];
            var viewNode = boundElements[binderIdx];

            // events
            if (binder.eventLocals != null && binder.localEvents != null) {
                for (var i = 0; i < binder.localEvents.length; i++) {
                    viewNode.createEventListener(view, binderIdx, binder.localEvents[i].name, binder.eventLocals);
                }
            }
        }

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
