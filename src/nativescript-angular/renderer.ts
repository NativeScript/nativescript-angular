import {Injectable} from 'angular2/angular2';
import {MapWrapper} from 'angular2/src/facade/collection';
import {DomProtoView, resolveInternalDomProtoView} from 'angular2/src/render/dom/view/proto_view';
import {
    Renderer,
    RenderEventDispatcher,
    RenderElementRef,
    RenderProtoViewRef,
    RenderViewRef,
    RenderFragmentRef,
    RenderViewWithFragments
} from 'angular2/src/render/api';
import {TemplateCloner} from 'angular2/src/render/dom/template_cloner';
import {NG_BINDING_CLASS, cloneAndQueryProtoView} from 'angular2/src/render/dom/util';
import {DOM} from 'angular2/src/dom/dom_adapter';

import {ViewNode} from 'nativescript-angular/view_node';

export class NativeScriptView {
    public eventDispatcher: RenderEventDispatcher;

    constructor(
        public proto: DomProtoView,
        public rootChildElements,
        public boundElements: Array<ViewNode>) {
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

export class NativeScriptFragmentRef extends RenderFragmentRef {
    constructor(private nodes: ViewNode[]) {
        super();
    }

    resolveNodes(): ViewNode[] {
        return this.nodes;
    }
}

@Injectable()
export class NativeScriptRenderer extends Renderer {
    constructor(private _templateCloner: TemplateCloner) {
        super();
        console.log('NativeScriptRenderer created');
    }

    createRootHostView(hostProtoViewRef: RenderProtoViewRef,
                        fragmentCount: number,
                        hostElementSelector: string): RenderViewWithFragments {
        console.log("NativeScriptRenderer.createRootHostView");
        var hostProtoView = resolveInternalDomProtoView(hostProtoViewRef);
        //return new NativeScriptViewRef(this._createView(hostProtoView, null, true));
        return this._createView(hostProtoView, null, true);
    }

    detachFreeHostView(parentHostViewRef: RenderViewRef, hostViewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.detachFreeHostView");
    }

    createView(protoViewRef: RenderProtoViewRef, fragmentCount: number): RenderViewWithFragments {
        console.log("NativeScriptRenderer.createView");
        var protoView = resolveInternalDomProtoView(protoViewRef);
        //return new NativeScriptViewRef(this._createView(protoView, null, false));
        return this._createView(protoView, null, false);
    }

    destroyView(viewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        //TODO: handle this when we resolve routing and navigation.
    }

    attachFragmentAfterFragment(previousFragmentRef: RenderFragmentRef, fragmentRef: RenderFragmentRef) {
        console.log("NativeScriptRenderer.attachFragmentAfterFragment");
        var previousFragmentNodes = (<NativeScriptFragmentRef>previousFragmentRef).resolveNodes();
        var lastNode: ViewNode = previousFragmentNodes[previousFragmentNodes.length - 1];
        var fragmentNodes = (<NativeScriptFragmentRef>fragmentRef).resolveNodes();

        this.attachFragmentAfter(lastNode, fragmentNodes);
    }

    attachFragmentAfterElement(location: RenderElementRef, fragmentRef: RenderFragmentRef) {
        console.log("NativeScriptRenderer.attachFragmentAfterElement");
        var hostView = (<NativeScriptViewRef>location.renderView).resolveView();
        var startNode: ViewNode = hostView.getBoundNode(location.renderBoundElementIndex);
        var fragmentNodes = (<NativeScriptFragmentRef>fragmentRef).resolveNodes();

        this.attachFragmentAfter(startNode, fragmentNodes);
    }

    private attachFragmentAfter(anchorNode: ViewNode, fragmentNodes: ViewNode[]) {
        var startIndex = anchorNode.parentNode.getChildIndex(anchorNode) + 1;

        fragmentNodes.forEach((node, index) => {
            console.log('attachFragmentAfterElement: child: ' + node.viewName + ' after: ' + anchorNode.viewName + ' startIndex: ' + startIndex + ' index: ' + index);
            anchorNode.parentNode.insertChildAt(startIndex + index, node);
            node.attachToView(startIndex + index);
        });
    }

    detachFragment(fragmentRef: RenderFragmentRef) {
        //TODO: implement...
        console.log('NativeScriptRenderer.detachFragment');
        var fragmentNodes = (<NativeScriptFragmentRef>fragmentRef).resolveNodes();
        fragmentNodes.forEach((node) => {
            console.log('detaching fragment child: ' + node.viewName);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        });
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
        var node = view.getBoundNode(location.renderBoundElementIndex);
        node.setProperty(propertyName, propertyValue);
    }

    setElementAttribute(location: RenderElementRef, attributeName: string, attributeValue: string) {
        console.log("NativeScriptRenderer.setElementAttribute " + attributeName + " = " + attributeValue);
        return this.setElementProperty(location, attributeName, attributeValue);
    }

    setElementClass(location: RenderElementRef, className: string, isAdd: boolean): void {
        console.log("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);

        var view = (<NativeScriptViewRef>location.renderView).resolveView();
        var node = view.getBoundNode(location.renderBoundElementIndex);
        if (isAdd) {
            node.addClass(className);
        } else {
            node.removeClass(className);
        }
    }

    getNativeElementSync(location: RenderElementRef): any {
        console.log("NativeScriptRenderer.getNativeElementSync");

        var view = (<NativeScriptViewRef>location.renderView).resolveView();
        var node = view.getBoundNode(location.renderBoundElementIndex);
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

    setEventDispatcher(viewRef: RenderViewRef, dispatcher: RenderEventDispatcher) {
        console.log("NativeScriptRenderer.setEventDispatcher ");
        var view = (<NativeScriptViewRef>viewRef).resolveView();
        view.eventDispatcher = dispatcher;
    }

    _createView(proto: DomProtoView, inplaceElement: HTMLElement, isRoot = false): RenderViewWithFragments {
        console.log("NativeScriptRenderer._createView ");

        var clonedProtoView = cloneAndQueryProtoView(this._templateCloner, proto, true);

        var nativeElements: Array<ViewNode>;
        var boundElements: Array<ViewNode> = [];

        var templateRoot = clonedProtoView.fragments[0][0];
        nativeElements = this._createNodes(null, [templateRoot], boundElements);

        if (isRoot) {
            nativeElements[0].attachToView();
        }

        var view = new NativeScriptView(proto, nativeElements, boundElements);

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

        let fragments = clonedProtoView.fragments.map(nodes => {
            console.log('Fragment with nodes: ' + nodes.length + ' first: ' + (<any>nodes[0]).name);
            return new NativeScriptFragmentRef(nativeElements)
        })
        return new RenderViewWithFragments(
            new NativeScriptViewRef(view), fragments);
    }

    _createNodes(parent: ViewNode, parsedChildren, boundElements: Array<ViewNode>): Array<ViewNode> {
        console.log('NativeScriptRenderer._createNodes ' + (parent ? parent.viewName : 'NULL'));
        var viewNodes = [];
        parsedChildren.forEach(node => {
            var viewNode: ViewNode;
            if (node.type == "tag") {
                viewNode = new ViewNode(parent, node.name, node.attribs);
            } else if (node.type == "text") {
                //viewNode = new ViewNode(parent, "rawtext", {text: node.data});
                //Ignore text nodes
                return;
            } else if (node.type == "root") {
                //viewNode = new ViewNode(parent, "root", {});
                //Ignore "root" elements.
                return;
            } else {
                console.dump(node);
                throw new Error('Unknown parse node type');
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
}
