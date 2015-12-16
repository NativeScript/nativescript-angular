import {Inject, Injectable} from 'angular2/src/core/di';
import {RenderComponentTemplate} from 'angular2/src/core/render/api';
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
import {isBlank} from 'angular2/src/facade/lang';
import {
    DefaultProtoViewRef,
    DefaultRenderView,
    DefaultRenderFragmentRef
} from 'angular2/src/core/render/view';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {ViewNode, DummyViewNode} from './view_node';

//var console = {log: function(msg) {}}

@Injectable()
export class NativeScriptRenderer extends Renderer implements NodeFactory<ViewNode> {
    constructor() {
        super();
        console.log('NativeScriptRenderer created');
    }

    public createProtoView(componentTemplateId: string, cmds: RenderTemplateCmd[]): RenderProtoViewRef {
        console.log('NativeScriptRenderer.createProtoView: ' + cmds);
        return new DefaultProtoViewRef(this._componentTemplates.get(componentTemplateId), cmds);
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
        var dpvr = <DefaultProtoViewRef>protoViewRef;
        var view = createRenderView(dpvr.template, dpvr.cmds, inplaceElement, this);
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

        let element = resolveBoundNode(location);
        let nodes = resolveInternalDomFragment(fragmentRef);
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

        let node = resolveBoundNode(location);
        node.setProperty(propertyName, propertyValue);
    }

    setElementAttribute(location: RenderElementRef, attributeName: string, attributeValue: string) {
        console.log("NativeScriptRenderer.setElementAttribute " + attributeName + " = " + attributeValue);
        return this.setElementProperty(location, attributeName, attributeValue);
    }

    setElementClass(location: RenderElementRef, className: string, isAdd: boolean): void {
        console.log("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);

        let node = resolveBoundNode(location);
        if (isAdd) {
            node.addClass(className);
        } else {
            node.removeClass(className);
        }
    }

    setElementStyle(location: RenderElementRef, styleName: string, styleValue: string): void {
        let node = resolveBoundNode(location);
        node.setStyleProperty(styleName, styleValue);
    }

    /**
    * Used only in debug mode to serialize property changes to comment nodes,
    * such as <template> placeholders.
    */
    setBindingDebugInfo(location: RenderElementRef, propertyName: string, propertyValue: string): void {
        let node = resolveBoundNode(location);
        console.log('NativeScriptRenderer.setBindingDebugInfo: ' + node.viewName + ', ' + propertyName + ' = ' + propertyValue);
    }


    getNativeElementSync(location: RenderElementRef): any {
        console.log("NativeScriptRenderer.getNativeElementSync");

        let node = resolveBoundNode(location);
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

    private _componentTemplates: Map<string, RenderComponentTemplate> = new Map<string, RenderComponentTemplate>();

    public registerComponentTemplate(template: RenderComponentTemplate) {
        console.log('NativeScriptRenderer.registerComponentTemplate: ' + template.id);
        this._componentTemplates.set(template.id, template);
    }

    public resolveComponentTemplate(templateId: string): RenderComponentTemplate {
        console.log('NativeScriptRenderer.resolveComponentTemplate: ' + templateId);
        return this._componentTemplates.get(templateId);
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

    public createShadowRoot(host: ViewNode, templateId: string): ViewNode {
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

function resolveBoundNode(elementRef: RenderElementRef): ViewNode {
    let view = resolveInternalDomView(elementRef.renderView);
    //Using an Angular internal API to get the index of the bound element.
    let internalBoundIndex = (<any>elementRef).boundElementIndex;
    return view.boundElements[internalBoundIndex]
}

function resolveInternalDomFragment(fragmentRef: RenderFragmentRef): ViewNode[] {
  return (<DefaultRenderFragmentRef<ViewNode>>fragmentRef).nodes;
}
