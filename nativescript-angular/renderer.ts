import {
    Inject, Injectable, Optional, NgZone,
    RendererV2, RendererFactoryV2, RendererTypeV2,
    // ViewEncapsulation
    // ɵAnimationStyles, ɵAnimationKeyframe,
} from "@angular/core";
import { APP_ROOT_VIEW, DEVICE } from "./platform-providers";
import { isBlank } from "./lang-facade";
import { View } from "ui/core/view";
import { addCss } from "application";
import { topmost } from "ui/frame";
import { ViewUtil } from "./view-util";
import { NgView } from "./element-registry";
import { rendererLog as traceLog } from "./trace";
import { escapeRegexSymbols } from "utils/utils";
import { Device } from "platform";

// CONTENT_ATTR not exported from NativeScript_renderer - we need it for styles application.
export const COMPONENT_VARIABLE = "%COMP%";
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;

@Injectable()
export class NativeScriptRendererFactory implements RendererFactoryV2 {
    private componentRenderers = new Map<string, NativeScriptRenderer>();
    private viewUtil: ViewUtil;
    private defaultRenderer: NativeScriptRenderer;
    private rootNgView: NgView;

    constructor(
        @Optional() @Inject(APP_ROOT_VIEW) rootView: View,
        @Inject(DEVICE) device: Device,
        zone: NgZone
    ) {
        this.viewUtil = new ViewUtil(device);
        this.setRootNgView(rootView);
        this.defaultRenderer = new NativeScriptRenderer(this.rootNgView, zone, this.viewUtil);
    }

    private setRootNgView(rootView: any) {
        if (!rootView) {
            rootView = <NgView><any>topmost().currentPage;
        }
        rootView.nodeName = "NONE";
        this.rootNgView = rootView;
    }

    createRenderer(element: any, type: RendererTypeV2): NativeScriptRenderer {
        if (!element || !type) {
            return this.defaultRenderer;
        }

        let renderer: NativeScriptRenderer = this.componentRenderers.get(type.id);
        if (isBlank(renderer)) {
            renderer = this.defaultRenderer;

            let stylesLength = type.styles.length;
            for (let i = 0; i < stylesLength; i++) {
                console.log(type.styles[i]);
                // this.hasComponentStyles = true;
                let cssString = type.styles[i] + "";
                const realCSS = this.replaceNgAttribute(cssString, type.id);
                addCss(realCSS);
            }
            this.componentRenderers.set(type.id, renderer);
        }

       return renderer;
    }

    private attrReplacer = new RegExp(escapeRegexSymbols(CONTENT_ATTR), "g");
    private attrSanitizer = /-/g;


    private replaceNgAttribute(input: string, componentId: string): string {
        return input.replace(this.attrReplacer,
            "_ng_content_" + componentId.replace(this.attrSanitizer, "_"));
    }
}

export class NativeScriptRenderer extends RendererV2 {
    data: {[key: string]: any} = Object.create(null);

    constructor(
        private rootView: NgView,
        private zone: NgZone,
        private viewUtil: ViewUtil
    ) {
        super();
        traceLog("NativeScriptRenderer created");
    }

    appendChild(parent: any, newChild: any): void {
        traceLog(`NativeScriptRenderer.appendChild child: ${newChild} parent: ${parent}`);
        this.viewUtil.insertChild(parent, newChild);
    }


    insertBefore(parent: any, newChild: any, refChild: any): void {
        traceLog(`NativeScriptRenderer.insertBefore child: ${newChild} parent: ${parent}`);
        if (parent) {
            parent.insertBefore(newChild, refChild);
        }
    }

    removeChild(parent: any, oldChild: NgView): void {
        traceLog(`NativeScriptRenderer.removeChild child: ${oldChild} parent: ${parent}`);
        this.viewUtil.removeChild(parent, oldChild);
    }

    selectRootElement(selector: string): NgView {
        traceLog("selectRootElement: " + selector);
        return this.rootView;
    }

    parentNode(node: NgView): NgView {
        return node.templateParent;
    }

    nextSibling(_node: NgView): void {
        traceLog(`NativeScriptRenderer.nextSibling ${_node}`);
    }

    createViewRoot(hostElement: NgView): NgView {
        traceLog("CREATE VIEW ROOT: " + hostElement.nodeName);
        return hostElement;
    }

    projectNodes(parentElement: NgView, nodes: NgView[]): void {
        traceLog("NativeScriptRenderer.projectNodes");
        nodes.forEach((node) => {
            this.viewUtil.insertChild(parentElement, node);
        });
    }

    destroy() {
        traceLog("NativeScriptRenderer.destroy");
        // Seems to be called on component dispose only (router outlet)
        // TODO: handle this when we resolve routing and navigation.
    }

    createComment(_value: any) {
        traceLog(`NativeScriptRenderer.createComment ${_value}`);
    }

    setAttribute(view: NgView, name: string, value: string) {
        traceLog(`NativeScriptRenderer.setAttribute ${view} : ${name} = ${value}`);
        return this.setProperty(view, name, value);
    }

    removeAttribute(_el: NgView, _name: string): void {
        traceLog(`NativeScriptRenderer.removeAttribute ${_el}: ${_name}`);
    }

    setProperty(view: any, name: string, value: any) {
        traceLog(`NativeScriptRenderer.setProperty ${view} : ${name} = ${value}`);
        this.viewUtil.setProperty(view, name, value);
    }

    addClass(view: NgView, name: string): void {
        traceLog(`NativeScriptRenderer.addClass ${name}`);
        this.viewUtil.addClass(view, name);
    }

    removeClass(view: NgView, name: string): void {
        traceLog(`NativeScriptRenderer.removeClass ${name}`);
        this.viewUtil.removeClass(view, name);
    }

    setStyle(view: NgView, styleName: string, value: any, _hasVendorPrefix?: boolean, _hasImportant?: boolean): void {
        traceLog(`NativeScriptRenderer.setStyle: ${styleName} = ${value}`);
        this.viewUtil.setStyle(view, styleName, value);
    }

    removeStyle(view: NgView, styleName: string, _hasVendorPrefix?: boolean): void {
        traceLog("NativeScriptRenderer.removeStyle: ${styleName}");
        this.viewUtil.removeStyle(view, styleName);
    }

    // Used only in debug mode to serialize property changes to comment nodes,
    // such as <template> placeholders.
    setBindingDebugInfo(renderElement: NgView, propertyName: string, propertyValue: string): void {
        traceLog("NativeScriptRenderer.setBindingDebugInfo: " + renderElement + ", " +
            propertyName + " = " + propertyValue);
    }

    setElementDebugInfo(renderElement: any, _info: any /*RenderDebugInfo*/): void {
        traceLog("NativeScriptRenderer.setElementDebugInfo: " + renderElement);
    }

    invokeElementMethod(_renderElement: NgView, methodName: string, args: Array<any>) {
        traceLog("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    setValue(_renderNode: any, _value: string) {
        traceLog("NativeScriptRenderer.setValue");
    }

    createElement(name: any, _namespace: string): NgView {
        traceLog(`NativeScriptRenderer.createElement: ${name}`);

        return this.viewUtil.createView(name, view => {
            console.log(view);
            // Set an attribute to the view to scope component-specific css.
            // The property name is pre-generated by Angular.

            // if (this.hasComponentStyles) {
            //     const cssAttribute = this.replaceNgAttribute(CONTENT_ATTR, this.componentProtoId);
            //     view[cssAttribute] = true;
            // }
        });
    }

    createText(_value: string): NgView {
        traceLog("NativeScriptRenderer.createText");
        return this.viewUtil.createText();
    }

    listen(renderElement: any, eventName: string, callback: (event: any) => boolean):
        () => void {
        traceLog("NativeScriptRenderer.listen: " + eventName);
        // Explicitly wrap in zone
        let zonedCallback = (...args) => {
            this.zone.run(() => {
                callback.apply(undefined, args);
            });
        };

        renderElement.on(eventName, zonedCallback);
        if (eventName === View.loadedEvent && renderElement.isLoaded) {
            const notifyData = { eventName: View.loadedEvent, object: renderElement };
            zonedCallback(notifyData);
        }
        return () => renderElement.off(eventName, zonedCallback);
    }
}

