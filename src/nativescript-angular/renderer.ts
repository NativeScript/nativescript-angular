import {Inject, Injectable} from 'angular2/src/core/di';
import {
    Renderer,
    RootRenderer,
    RenderComponentType
} from 'angular2/src/core/render/api';
import {isBlank} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {View} from "ui/core/view";
import {topmost} from 'ui/frame';
import * as util from "./view-util";

//var console = {log: function(msg) {}}

@Injectable()
export class NativeScriptRootRenderer extends RootRenderer {
    private _registeredComponents: Map<string, NativeScriptRenderer> = new Map<string, NativeScriptRenderer>();

    renderComponent(componentProto: RenderComponentType): Renderer {
        var renderer = this._registeredComponents.get(componentProto.id);
        if (isBlank(renderer)) {
            renderer = new NativeScriptRenderer(this, componentProto);
            this._registeredComponents.set(componentProto.id, renderer);
        }
        return renderer;
    }
}

@Injectable()
export class NativeScriptRenderer extends Renderer {
    constructor(private _rootRenderer: NativeScriptRootRenderer, private componentProto: RenderComponentType) {
        super();
        console.log('NativeScriptRenderer created');
    }

    renderComponent(componentProto: RenderComponentType): Renderer {
        return this._rootRenderer.renderComponent(componentProto);
    }

    selectRootElement(selector: string): util.NgView {
        console.log('ROOT');
        const page = <util.NgView><any>topmost().currentPage;
        page.nodeName = 'Page';
        return page;
    }

    createViewRoot(hostElement: util.NgView): util.NgView {
        console.log('CREATE VIEW ROOT: ' + hostElement.nodeName);
        return hostElement;
    }

    projectNodes(parentElement: util.NgView, nodes: util.NgView[]): void {
        console.log('NativeScriptRenderer.projectNodes');
        nodes.forEach((node) => {
            util.insertChild(parentElement, node);
        });
    }

    attachViewAfter(anchorNode: util.NgView, viewRootNodes: util.NgView[]) {
        console.log('NativeScriptRenderer.attachViewAfter: ' + anchorNode.nodeName + ' ' + anchorNode);
        const parent = (<util.NgView>anchorNode.parent || anchorNode.templateParent);
        const insertPosition = util.getChildIndex(parent, anchorNode);

        viewRootNodes.forEach((node, index) => {
            const childIndex = insertPosition + index + 1;
            util.insertChild(parent, node, childIndex);
            this.animateNodeEnter(node);
        });
    }

    detachView(viewRootNodes: util.NgView[]) {
        console.log('NativeScriptRenderer.detachView');
        for (var i = 0; i < viewRootNodes.length; i++) {
            var node = viewRootNodes[i];
            util.removeChild(<util.NgView>node.parent, node);
            this.animateNodeLeave(node);
        }
    }

    animateNodeEnter(node: util.NgView) {
    }

    animateNodeLeave(node: util.NgView) {
    }

    public destroyView(hostElement: util.NgView, viewAllNodes: util.NgView[]) {
        console.log("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        //TODO: handle this when we resolve routing and navigation.
    }

    setElementProperty(renderElement: util.NgView, propertyName: string, propertyValue: any) {
        console.log("NativeScriptRenderer.setElementProperty " + renderElement + ': ' + propertyName + " = " + propertyValue);
        util.setProperty(renderElement, propertyName, propertyValue);
    }

    setElementAttribute(renderElement: util.NgView, attributeName: string, attributeValue: string) {
        console.log("NativeScriptRenderer.setElementAttribute " + renderElement + ': ' + attributeName + " = " + attributeValue);
        return this.setElementProperty(renderElement, attributeName, attributeValue);
    }

    setElementClass(renderElement: util.NgView, className: string, isAdd: boolean): void {
        console.log("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);

        if (isAdd) {
            util.addClass(renderElement, className);
        } else {
            util.removeClass(renderElement, className);
        }
    }

    setElementStyle(renderElement: util.NgView, styleName: string, styleValue: string): void {
        util.setStyleProperty(renderElement, styleName, styleValue);
    }

    /**
    * Used only in debug mode to serialize property changes to comment nodes,
    * such as <template> placeholders.
    */
    setBindingDebugInfo(renderElement: util.NgView, propertyName: string, propertyValue: string): void {
        console.log('NativeScriptRenderer.setBindingDebugInfo: ' + renderElement + ', ' + propertyName + ' = ' + propertyValue);
    }

    /**
    * Calls a method on an element.
    */
    invokeElementMethod(renderElement: util.NgView, methodName: string, args: Array<any>) {
        console.log("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    setText(renderNode: any, text: string) {
        console.log("NativeScriptRenderer.setText");
    }

    public createTemplateAnchor(parentElement: util.NgView): util.NgView {
        console.log('NativeScriptRenderer.createTemplateAnchor');
        return util.createTemplateAnchor(parentElement);
    }

    public createElement(parentElement: util.NgView, name: string): util.NgView {
        console.log('NativeScriptRenderer.createElement: ' + name + ' parent: ' + parentElement + ', ' + (parentElement ? parentElement.nodeName : 'null'));
        return util.createView(name, parentElement);
    }

    public createText(value: string): util.NgView {
        console.log('NativeScriptRenderer.createText');
        return util.createText(value);;
    }

    public listen(renderElement: util.NgView, eventName: string, callback: Function): Function {
        console.log('NativeScriptRenderer.listen: ' + eventName);
        let zonedCallback = global.zone.bind(callback);
        renderElement.on(eventName, zonedCallback);
        return () => renderElement.off(eventName, zonedCallback);
    }

    public listenGlobal(target: string, eventName: string, callback: Function): Function {
        throw new Error('Not implemented.');
    }
}
