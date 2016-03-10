import {Inject, Injectable, Optional} from 'angular2/src/core/di';
import {
    Renderer,
    RootRenderer,
    RenderComponentType,
    RenderDebugInfo
} from 'angular2/src/core/render/api';
import {APP_ROOT_VIEW} from "./platform-providers";
import {isBlank} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {COMPONENT_VARIABLE, CONTENT_ATTR} from 'angular2/src/platform/dom/dom_renderer';
import {View} from "ui/core/view";
import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import * as util from "./view-util";

export { rendererTraceCategory } from "./view-util";

@Injectable()
export class NativeScriptRootRenderer implements RootRenderer {
    private _rootView: View = null;
    constructor(@Optional() @Inject(APP_ROOT_VIEW) rootView: View) {
        this._rootView = rootView;
    }

    private _registeredComponents: Map<string, NativeScriptRenderer> = new Map<string, NativeScriptRenderer>();

    public get rootView(): View {
        if (!this._rootView) {
            this._rootView = topmost().currentPage;
        }
        return this._rootView;
    }

    public get page(): Page {
        return <Page>this.rootView.page;
    }

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
    private componentProtoId: string;
    private hasComponentStyles: boolean;
    private rootRenderer: NativeScriptRootRenderer;
    constructor(private _rootRenderer: NativeScriptRootRenderer, private componentProto: RenderComponentType) {
        super();
        this.rootRenderer = _rootRenderer;
        let page = this.rootRenderer.page;
        let stylesLength = componentProto.styles.length;
        this.componentProtoId = componentProto.id;
        for(let i = 0; i < stylesLength; i++) {
            this.hasComponentStyles = true;
            let cssString = componentProto.styles[i] + "";
            page.addCss(cssString.replace(COMPONENT_VARIABLE, componentProto.id));
        }
        util.traceLog('NativeScriptRenderer created');
    }

    renderComponent(componentProto: RenderComponentType): Renderer {
        return this._rootRenderer.renderComponent(componentProto);
    }

    selectRootElement(selector: string): util.NgView {
        util.traceLog('selectRootElement: ' + selector);
        const rootView = <util.NgView><any>this.rootRenderer.rootView;
        rootView.nodeName = 'ROOT';
        return rootView;
    }

    createViewRoot(hostElement: util.NgView): util.NgView {
        util.traceLog('CREATE VIEW ROOT: ' + hostElement.nodeName);
        return hostElement;
    }

    projectNodes(parentElement: util.NgView, nodes: util.NgView[]): void {
        util.traceLog('NativeScriptRenderer.projectNodes');
        nodes.forEach((node) => {
            util.insertChild(parentElement, node);
        });
    }

    attachViewAfter(anchorNode: util.NgView, viewRootNodes: util.NgView[]) {
        util.traceLog('NativeScriptRenderer.attachViewAfter: ' + anchorNode.nodeName + ' ' + anchorNode);
        const parent = (<util.NgView>anchorNode.parent || anchorNode.templateParent);
        const insertPosition = util.getChildIndex(parent, anchorNode);

        viewRootNodes.forEach((node, index) => {
            const childIndex = insertPosition + index + 1;
            util.insertChild(parent, node, childIndex);
            this.animateNodeEnter(node);
        });
    }

    detachView(viewRootNodes: util.NgView[]) {
        util.traceLog('NativeScriptRenderer.detachView');
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
        util.traceLog("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        //TODO: handle this when we resolve routing and navigation.
    }

    setElementProperty(renderElement: util.NgView, propertyName: string, propertyValue: any) {
        util.traceLog("NativeScriptRenderer.setElementProperty " + renderElement + ': ' + propertyName + " = " + propertyValue);
        util.setProperty(renderElement, propertyName, propertyValue);
    }

    setElementAttribute(renderElement: util.NgView, attributeName: string, attributeValue: string) {
        util.traceLog("NativeScriptRenderer.setElementAttribute " + renderElement + ': ' + attributeName + " = " + attributeValue);
        return this.setElementProperty(renderElement, attributeName, attributeValue);
    }

    setElementClass(renderElement: util.NgView, className: string, isAdd: boolean): void {
        util.traceLog("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);

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
        util.traceLog('NativeScriptRenderer.setBindingDebugInfo: ' + renderElement + ', ' + propertyName + ' = ' + propertyValue);
    }

    setElementDebugInfo(renderElement: any, info: RenderDebugInfo): void {
        util.traceLog('NativeScriptRenderer.setElementDebugInfo: ' + renderElement);
    }

    /**
    * Calls a method on an element.
    */
    invokeElementMethod(renderElement: util.NgView, methodName: string, args: Array<any>) {
        util.traceLog("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    setText(renderNode: any, text: string) {
        util.traceLog("NativeScriptRenderer.setText");
    }

    public createTemplateAnchor(parentElement: util.NgView): util.NgView {
        util.traceLog('NativeScriptRenderer.createTemplateAnchor');
        return util.createTemplateAnchor(parentElement);
    }

    public createElement(parentElement: util.NgView, name: string): util.NgView {
        util.traceLog('NativeScriptRenderer.createElement: ' + name + ' parent: ' + parentElement + ', ' + (parentElement ? parentElement.nodeName : 'null'));
        let result = util.createView(name, parentElement);
        // adding an attribute (property) to {N} view for applying component specific css. 
        // The property value is generated by angular2 infrastructure on conponent creation. 
        if (this.hasComponentStyles) {
            result[CONTENT_ATTR.replace(COMPONENT_VARIABLE, this.componentProtoId)] = true;
        }
        return result;
    }

    public createText(value: string): util.NgView {
        util.traceLog('NativeScriptRenderer.createText');
        return util.createText(value);;
    }

    public listen(renderElement: util.NgView, eventName: string, callback: Function): Function {
        util.traceLog('NativeScriptRenderer.listen: ' + eventName);
        let zonedCallback = (<any>global).zone.bind(callback);
        renderElement.on(eventName, zonedCallback);
        return () => renderElement.off(eventName, zonedCallback);
    }

    public listenGlobal(target: string, eventName: string, callback: Function): Function {
        throw new Error('Not implemented.');
    }
}
