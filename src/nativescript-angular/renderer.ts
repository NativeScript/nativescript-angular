import {Inject, Injectable, Optional} from 'angular2/src/core/di';
import {
    Renderer,
    RootRenderer,
    RenderComponentType,
    RenderDebugInfo
} from 'angular2/src/core/render/api';
import {APP_ROOT_VIEW, DEVICE} from "./platform-providers";
import {isBlank} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {COMPONENT_VARIABLE, CONTENT_ATTR} from 'angular2/src/platform/dom/dom_renderer';
import {View} from "ui/core/view";
import * as application from "application";
import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import {traceLog, ViewUtil, NgView} from "./view-util";
import {escapeRegexSymbols} from "utils/utils";
import { Device } from "platform";

export { rendererTraceCategory } from "./view-util";

@Injectable()
export class NativeScriptRootRenderer implements RootRenderer {
    private _rootView: View = null;
    private _viewUtil: ViewUtil;

    constructor( @Optional() @Inject(APP_ROOT_VIEW) rootView: View, @Inject(DEVICE) device: Device) {
        this._rootView = rootView;
        this._viewUtil = new ViewUtil(device);
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

    public get viewUtil(): ViewUtil {
        return this._viewUtil;
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

    private get viewUtil(): ViewUtil {
        return this.rootRenderer.viewUtil;
    }

    constructor(private _rootRenderer: NativeScriptRootRenderer, private componentProto: RenderComponentType) {
        super();
        this.rootRenderer = _rootRenderer;
        let page = this.rootRenderer.page;
        let stylesLength = componentProto.styles.length;
        this.componentProtoId = componentProto.id;
        for (let i = 0; i < stylesLength; i++) {
            this.hasComponentStyles = true;
            let cssString = componentProto.styles[i] + "";
            const realCSS = this.replaceNgAttribute(cssString, this.componentProtoId);
            application.addCss(realCSS);
        }
        traceLog('NativeScriptRenderer created');
    }

    private attrReplacer = new RegExp(escapeRegexSymbols(CONTENT_ATTR), "g");
    private attrSanitizer = /-/g;

    private replaceNgAttribute(input: string, componentId: string): string {
        return input.replace(this.attrReplacer,
            "_ng_content_" + componentId.replace(this.attrSanitizer, "_"));
    }

    renderComponent(componentProto: RenderComponentType): Renderer {
        return this._rootRenderer.renderComponent(componentProto);
    }

    selectRootElement(selector: string): NgView {
        traceLog('selectRootElement: ' + selector);
        const rootView = <NgView><any>this.rootRenderer.rootView;
        rootView.nodeName = 'ROOT';
        return rootView;
    }

    createViewRoot(hostElement: NgView): NgView {
        traceLog('CREATE VIEW ROOT: ' + hostElement.nodeName);
        return hostElement;
    }

    projectNodes(parentElement: NgView, nodes: NgView[]): void {
        traceLog('NativeScriptRenderer.projectNodes');
        nodes.forEach((node) => {
            this.viewUtil.insertChild(parentElement, node);
        });
    }

    attachViewAfter(anchorNode: NgView, viewRootNodes: NgView[]) {
        traceLog('NativeScriptRenderer.attachViewAfter: ' + anchorNode.nodeName + ' ' + anchorNode);
        const parent = (<NgView>anchorNode.parent || anchorNode.templateParent);
        const insertPosition = this.viewUtil.getChildIndex(parent, anchorNode);

        viewRootNodes.forEach((node, index) => {
            const childIndex = insertPosition + index + 1;
            this.viewUtil.insertChild(parent, node, childIndex);
            this.animateNodeEnter(node);
        });
    }

    detachView(viewRootNodes: NgView[]) {
        traceLog('NativeScriptRenderer.detachView');
        for (var i = 0; i < viewRootNodes.length; i++) {
            var node = viewRootNodes[i];
            this.viewUtil.removeChild(<NgView>node.parent, node);
            this.animateNodeLeave(node);
        }
    }

    animateNodeEnter(node: NgView) {
    }

    animateNodeLeave(node: NgView) {
    }

    public destroyView(hostElement: NgView, viewAllNodes: NgView[]) {
        traceLog("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        //TODO: handle this when we resolve routing and navigation.
    }

    setElementProperty(renderElement: NgView, propertyName: string, propertyValue: any) {
        traceLog("NativeScriptRenderer.setElementProperty " + renderElement + ': ' + propertyName + " = " + propertyValue);
        this.viewUtil.setProperty(renderElement, propertyName, propertyValue);
    }

    setElementAttribute(renderElement: NgView, attributeName: string, attributeValue: string) {
        traceLog("NativeScriptRenderer.setElementAttribute " + renderElement + ': ' + attributeName + " = " + attributeValue);
        return this.setElementProperty(renderElement, attributeName, attributeValue);
    }

    setElementClass(renderElement: NgView, className: string, isAdd: boolean): void {
        traceLog("NativeScriptRenderer.setElementClass " + className + " - " + isAdd);

        if (isAdd) {
            this.viewUtil.addClass(renderElement, className);
        } else {
            this.viewUtil.removeClass(renderElement, className);
        }
    }

    setElementStyle(renderElement: NgView, styleName: string, styleValue: string): void {
        this.viewUtil.setStyleProperty(renderElement, styleName, styleValue);
    }

    /**
    * Used only in debug mode to serialize property changes to comment nodes,
    * such as <template> placeholders.
    */
    setBindingDebugInfo(renderElement: NgView, propertyName: string, propertyValue: string): void {
        traceLog('NativeScriptRenderer.setBindingDebugInfo: ' + renderElement + ', ' + propertyName + ' = ' + propertyValue);
    }

    setElementDebugInfo(renderElement: any, info: RenderDebugInfo): void {
        traceLog('NativeScriptRenderer.setElementDebugInfo: ' + renderElement);
    }

    /**
    * Calls a method on an element.
    */
    invokeElementMethod(renderElement: NgView, methodName: string, args: Array<any>) {
        traceLog("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    setText(renderNode: any, text: string) {
        traceLog("NativeScriptRenderer.setText");
    }

    public createTemplateAnchor(parentElement: NgView): NgView {
        traceLog('NativeScriptRenderer.createTemplateAnchor');
        return this.viewUtil.createTemplateAnchor(parentElement);
    }

    public createElement(parentElement: NgView, name: string): NgView {
        traceLog('NativeScriptRenderer.createElement: ' + name + ' parent: ' + parentElement + ', ' + (parentElement ? parentElement.nodeName : 'null'));
        return this.viewUtil.createView(name, parentElement, (view) => {
            // Set an attribute to the view to scope component-specific css.
            // The property name is pre-generated by Angular.
            if (this.hasComponentStyles) {
                const cssAttribute = this.replaceNgAttribute(CONTENT_ATTR, this.componentProtoId);
                view[cssAttribute] = true;
            }
        });
    }

    public createText(parentElement: NgView, value: string): NgView {
        traceLog('NativeScriptRenderer.createText');
        return this.viewUtil.createText(value);;
    }

    public listen(renderElement: NgView, eventName: string, callback: Function): Function {
        traceLog('NativeScriptRenderer.listen: ' + eventName);
        let zonedCallback = (<any>global).Zone.current.wrap(callback);
        renderElement.on(eventName, zonedCallback);
        return () => renderElement.off(eventName, zonedCallback);
    }

    public listenGlobal(target: string, eventName: string, callback: Function): Function {
        throw new Error('Not implemented.');
    }
}
