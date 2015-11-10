import {Inject, Injectable} from 'angular2/src/core/di';
import {DOCUMENT} from 'angular2/src/core/render/dom/dom_tokens';
import {createRenderView, NodeFactory} from 'angular2/src/core/render/view_factory';
import {
    Renderer,
    RenderEventDispatcher,
    RenderElementRef,
    RenderProtoViewRef,
    RenderViewRef,
    RenderFragmentRef,
    RenderViewWithFragments,
    RenderTemplateCmd
} from 'angular2/src/core/render/api';
import {isBlank} from 'angular2/src/core/facade/lang';
import {
    DefaultProtoViewRef,
    DefaultRenderView,
    DefaultRenderFragmentRef
} from 'angular2/src/core/render/view';
import {DOM} from 'angular2/src/core/dom/dom_adapter';
import {ViewNode, DummyViewNode} from 'nativescript-angular/view_node';

//var console = {log: function(msg) {}}

@Injectable()
export class NativeScriptRenderer extends Renderer implements NodeFactory<ViewNode> {
    private _document;

    constructor(@Inject(DOCUMENT) document) {
        super();
        console.log('NativeScriptRenderer created');
        this._document = document;
    }

    public createProtoView(cmds: RenderTemplateCmd[]): RenderProtoViewRef {
        console.log('NativeScriptRenderer.createProtoView: ' + cmds);
        return new DefaultProtoViewRef(cmds);
    }

    public createRootHostView(
        hostProtoViewRef: RenderProtoViewRef,
        fragmentCount: number,
        hostElementSelector: string
    ): RenderViewWithFragments {
        console.log("NativeScriptRenderer.createRootHostView");

        let rootViewWithFragments = this._createView(hostProtoViewRef, null);

        let rootView = resolveInternalDomView(rootViewWithFragments.viewRef);
        let rootNode = rootView.boundElements[0];
        rootNode.attachToView();

        return rootViewWithFragments;
    }

    public createView(protoViewRef: RenderProtoViewRef, fragmentCount: number): RenderViewWithFragments {
        console.log("NativeScriptRenderer.createView");
        return this._createView(protoViewRef, null);
    }

    private _createView(protoViewRef: RenderProtoViewRef, inplaceElement: HTMLElement): RenderViewWithFragments {
        var view = createRenderView((<DefaultProtoViewRef>protoViewRef).cmds, inplaceElement, this);
        return new RenderViewWithFragments(view, view.fragments);
    }

    public destroyView(viewRef: RenderViewRef) {
        console.log("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        //TODO: handle this when we resolve routing and navigation.
    }

    public getRootNodes(fragment: RenderFragmentRef): ViewNode[] {
        return resolveInternalDomFragment(fragment);
    }

    public attachFragmentAfterFragment(previousFragmentRef: RenderFragmentRef, fragmentRef: RenderFragmentRef) {
        console.log("NativeScriptRenderer.attachFragmentAfterFragment");

        var previousFragmentNodes = resolveInternalDomFragment(previousFragmentRef);
        if (previousFragmentNodes.length > 0) {
            var sibling = previousFragmentNodes[previousFragmentNodes.length - 1];
            let nodes = resolveInternalDomFragment(fragmentRef);
            this.attachFragmentAfter(sibling, nodes);
        }
    }

    public attachFragmentAfterElement(location: RenderElementRef, fragmentRef: RenderFragmentRef) {
        console.log("NativeScriptRenderer.attachFragmentAfterElement");

        var parentView = resolveInternalDomView(location.renderView);
        var element = parentView.boundElements[location.boundElementIndex];
        var nodes = resolveInternalDomFragment(fragmentRef);
        this.attachFragmentAfter(element, nodes);
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
        console.log('NativeScriptRenderer.detachFragment');

        var fragmentNodes = resolveInternalDomFragment(fragmentRef);
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

        var view = resolveInternalDomView(location.renderView);
        var node = view.boundElements[location.boundElementIndex];
        node.setProperty(propertyName, propertyValue);
    }

    setElementAttribute(location: RenderElementRef, attributeName: string, attributeValue: string) {
        console.log("NativeScriptRenderer.setElementAttribute " + attributeName + " = " + attributeValue);
        return this.setElementProperty(location, attributeName, attributeValue);
    }

    setElementClass(location: RenderElementRef, className: string, isAdd: boolean): void {
        console.log("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);

        var view = resolveInternalDomView(location.renderView);
        var node = view.boundElements[location.boundElementIndex];
        if (isAdd) {
            node.addClass(className);
        } else {
            node.removeClass(className);
        }
    }

    setElementStyle(location: RenderElementRef, styleName: string, styleValue: string): void {
        var view = resolveInternalDomView(location.renderView);
        var node = view.boundElements[location.boundElementIndex];
        node.setStyleProperty(styleName, styleValue);
    }

    getNativeElementSync(location: RenderElementRef): any {
        console.log("NativeScriptRenderer.getNativeElementSync");

        var view = resolveInternalDomView(location.renderView);
        var node = view.boundElements[location.boundElementIndex];
        return node.nativeView;
    }

    /**
    * Calls a method on an element.
    */
    invokeElementMethod(location: RenderElementRef, methodName: string, args: Array<any>) {
        console.log("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    setText(viewRef: RenderViewRef, textNodeIndex: number, text: string) {
        console.log("NativeScriptRenderer.setText ");
    }

    setEventDispatcher(viewRef: RenderViewRef, dispatcher: RenderEventDispatcher) {
        console.log("NativeScriptRenderer.setEventDispatcher ");
        var view = resolveInternalDomView(viewRef);
        view.eventDispatcher = dispatcher;
    }

    private _componentCmds: Map<number, RenderTemplateCmd[]> = new Map<number, RenderTemplateCmd[]>();

    public registerComponentTemplate(
        templateId: number,
        commands: RenderTemplateCmd[],
        styles: string[],
        nativeShadow: boolean
    ) {
        console.log('NativeScriptRenderer.registerComponentTemplate: ' + templateId);
        this._componentCmds.set(templateId, commands);
    }

    public resolveComponentTemplate(templateId: number): RenderTemplateCmd[] {
        console.log('NativeScriptRenderer.resolveComponentTemplate: ' + templateId);
        return this._componentCmds.get(templateId);
    }

    public createRootContentInsertionPoint(): ViewNode {
        return this.createTemplateAnchor([]);
    }

    public createTemplateAnchor(attrNameAndValues: string[]): ViewNode {
        console.log('NativeScriptRenderer.createTemplateAnchor');
        return new ViewNode(null, 'template', attrNameAndValues);
    }

    public createElement(name: string, attrNameAndValues: string[]): ViewNode {
        console.log('NativeScriptRenderer.createElement: ' + name);
        return new ViewNode(null, name, attrNameAndValues);
    }

    public mergeElement(existing: ViewNode, attrNameAndValues: string[]){
        console.log('NativeScriptRenderer.mergeElement: ' + existing.viewName);
        existing.clearChildren();
        existing.setAttributeValues(attrNameAndValues);
    }

    public createShadowRoot(host: ViewNode, templateId: number): ViewNode {
        throw new Error('Not implemented.');
    }

    public createText(value: string): ViewNode {
        console.log('NativeScriptRenderer.createText');
        return new DummyViewNode(null);
    }

    public appendChild(parent: ViewNode, child: ViewNode) {
        console.log('NativeScriptRenderer.appendChild: ' + parent.viewName + ' -> ' + child.viewName);
        parent.appendChild(child);
    }

    public on(element: ViewNode, eventName: string, callback: Function) {
        console.log('NativeScriptRenderer.on: ' + eventName);
        let zonedCallback = global.zone.bind(callback);
        element.on(eventName, zonedCallback);
    }

    public globalOn(target: string, eventName: string, callback: Function): Function {
        throw new Error('Not implemented.');
    }
}

function resolveInternalDomView(viewRef: RenderViewRef): DefaultRenderView<ViewNode> {
  return <DefaultRenderView<ViewNode>>viewRef;
}

function resolveInternalDomFragment(fragmentRef: RenderFragmentRef): ViewNode[] {
  return (<DefaultRenderFragmentRef<ViewNode>>fragmentRef).nodes;
}
