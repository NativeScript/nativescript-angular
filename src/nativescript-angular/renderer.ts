import {Injectable} from 'angular2/angular2';
import {MapWrapper} from 'angular2/src/facade/collection';
import {DomProtoView, resolveInternalDomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {Renderer, RenderElementRef, RenderProtoViewRef, RenderViewRef, EventDispatcher} from 'angular2/src/render/api';
import {NG_BINDING_CLASS} from 'angular2/src/render/dom/util';
import {DOM} from 'angular2/src/dom/dom_adapter';

import {ViewNode} from 'nativescript-angular/view_node';

export class NativeScriptView {
    public eventDispatcher: EventDispatcher;

    constructor(public proto: DomProtoView,
        public rootChildElements,
        public boundElements: Array<ViewNode>,
    public boundTextNodes) {
    }

    getBoundNode(index: number): ViewNode {
        return this.boundElements[index];
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
        // Seems to be called on component dispose only (router outlet)
        //TODO: handle this when we resolve routing and navigation.
    }

    attachComponentView(location: RenderElementRef, componentViewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.attachComponentView");
        var hostView = (<NativeScriptViewRef>location.renderView).resolveView();
        var parentNode = hostView.getBoundNode(location.boundElementIndex);
        var componentView = (<NativeScriptViewRef>componentViewRef).resolveView();
        componentView.rootChildElements.forEach((child, index) => {
            parentNode.insertChildAt(index, child);
        });
    }

    /**
    * Detaches a componentView into the given hostView at the given element
    */
    detachComponentView(location: RenderElementRef, componentViewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.detachComponentView ");
        //TODO: detach/destroy visual tree
    }

    attachViewInContainer(location: RenderElementRef, atIndex: number, viewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.attachViewInContainer ");
    }

    detachViewInContainer(location: RenderElementRef, atIndex: number, viewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.detachViewInContainer ");
    }

    hydrateView(viewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.hydrateView ");
        //DOING nothing -- the view init code happens on attach: ViewNode#createUI
    }

    dehydrateView(viewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.dehydrateView");
        //TODO: detach events
    }

    setElementProperty(location: RenderElementRef, propertyName: string, propertyValue: any) {
        console.log("NativeScriptRenderer.setElementProperty " + propertyName + " = " + propertyValue);

        var view = (<NativeScriptViewRef>location.renderView).resolveView();
        var node = view.getBoundNode(location.boundElementIndex);
        node.setProperty(propertyName, propertyValue);
    }

    setElementAttribute(location: RenderElementRef, attributeName: string, attributeValue: string) {
        console.log("NativeScriptRenderer.setElementAttribute " + attributeName + " = " + attributeValue);
    }

    getNativeElementSync(location: RenderElementRef): any {
        console.log("NativeScriptRenderer.getNativeElementSync");

        var view = (<NativeScriptViewRef>location.renderView).resolveView();
        var node = view.getBoundNode(location.boundElementIndex);
        return node.nativeView;
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
                //TODO: maybe detect and store #id/var-id variable bindings and
                //pass them as the locals map to event handlers.
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
