import {
    Inject, Injectable, Optional, NgZone,
    Renderer2, RendererFactory2, RendererType2,
    RendererStyleFlags2, ViewEncapsulation,
} from "@angular/core";

import { View } from "ui/core/view";
import { addCss } from "application";
import { topmost } from "ui/frame";
import { Device } from "platform";

import { isBlank } from "./lang-facade";
import { ViewUtil } from "./view-util";
import { APP_ROOT_VIEW, DEVICE, getRootPage } from "./platform-providers";
import { NgView } from "./element-registry";
import { rendererLog as traceLog } from "./trace";

// CONTENT_ATTR not exported from NativeScript_renderer - we need it for styles application.
const COMPONENT_REGEX = /%COMP%/g;
export const COMPONENT_VARIABLE = "%COMP%";
export const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
const ATTR_SANITIZER = /-/g;

@Injectable()
export class NativeScriptRendererFactory implements RendererFactory2 {
    private componentRenderers = new Map<string, NativeScriptRenderer>();
    private viewUtil: ViewUtil;
    private defaultRenderer: NativeScriptRenderer;
    private rootNgView: NgView;

    constructor(
        @Optional() @Inject(APP_ROOT_VIEW) rootView: View,
        @Inject(DEVICE) device: Device,
        private zone: NgZone
    ) {
        this.viewUtil = new ViewUtil(device);
        this.setRootNgView(rootView);
        this.defaultRenderer = new NativeScriptRenderer(this.rootNgView, zone, this.viewUtil);
    }

    private setRootNgView(rootView: any) {
        if (!rootView) {
            rootView = getRootPage() || topmost().currentPage;
        }

        rootView.nodeName = "NONE";
        this.rootNgView = rootView;
    }

    createRenderer(element: any, type: RendererType2): NativeScriptRenderer {
        if (!element || !type) {
            return this.defaultRenderer;
        }

        let renderer: NativeScriptRenderer = this.componentRenderers.get(type.id);
        if (!isBlank(renderer)) {
            return renderer;
        }

        if (type.encapsulation === ViewEncapsulation.Emulated) {
            renderer = new EmulatedRenderer(type, this.rootNgView, this.zone, this.viewUtil);
            (<EmulatedRenderer>renderer).applyToHost(element);
        } else {
            renderer = this.defaultRenderer;
        }

        this.componentRenderers.set(type.id, renderer);
        return renderer;
    }
}

export class NativeScriptRenderer extends Renderer2 {
    data: { [key: string]: any } = Object.create(null);

    constructor(
        private rootView: NgView,
        private zone: NgZone,
        private viewUtil: ViewUtil
    ) {
        super();
        traceLog("NativeScriptRenderer created");
    }

    appendChild(parent: any, newChild: NgView): void {
        traceLog(`NativeScriptRenderer.appendChild child: ${newChild} parent: ${parent}`);

        if (parent) {
            this.viewUtil.insertChild(parent, newChild);
        }
    }

    insertBefore(parent: NgView, newChild: NgView, refChildIndex: number): void {
        traceLog(`NativeScriptRenderer.insertBefore child: ${newChild} parent: ${parent}`);

        if (parent) {
            this.viewUtil.insertChild(parent, newChild, refChildIndex);
        }
    }

    removeChild(parent: any, oldChild: NgView): void {
        traceLog(`NativeScriptRenderer.removeChild child: ${oldChild} parent: ${parent}`);

        if (parent) {
            this.viewUtil.removeChild(parent, oldChild);
        }
    }

    selectRootElement(selector: string): NgView {
        traceLog("selectRootElement: " + selector);
        return this.rootView;
    }

    parentNode(node: NgView): any {
        return node.parent;
    }

    nextSibling(node: NgView): number {
        traceLog(`NativeScriptRenderer.nextSibling ${node}`);
        return this.viewUtil.nextSiblingIndex(node);
    }

    createComment(_value: any) {
        traceLog(`NativeScriptRenderer.createComment ${_value}`);
        return this.viewUtil.createComment();
    }

    createElement(name: any, _namespace: string): NgView {
        traceLog(`NativeScriptRenderer.createElement: ${name}`);
        return this.viewUtil.createView(name);
    }

    createText(_value: string) {
        traceLog(`NativeScriptRenderer.createText ${_value}`);
        return this.viewUtil.createText();
    }

    createViewRoot(hostElement: NgView): NgView {
        traceLog(`NativeScriptRenderer.createViewRoot ${hostElement.nodeName}`);
        return hostElement;
    }

    projectNodes(parentElement: NgView, nodes: NgView[]): void {
        traceLog("NativeScriptRenderer.projectNodes");
        nodes.forEach((node) => this.viewUtil.insertChild(parentElement, node));
    }

    destroy() {
        traceLog("NativeScriptRenderer.destroy");
        // Seems to be called on component dispose only (router outlet)
        // TODO: handle this when we resolve routing and navigation.
    }

    setAttribute(view: NgView, name: string, value: string, namespace?: string) {
        traceLog(`NativeScriptRenderer.setAttribute ${view} : ${name} = ${value}, namespace: ${namespace}`);
        return this.viewUtil.setProperty(view, name, value, namespace);
    }

    removeAttribute(_el: NgView, _name: string): void {
        traceLog(`NativeScriptRenderer.removeAttribute ${_el}: ${_name}`);
    }

    setProperty(view: any, name: string, value: any) {
        traceLog(`NativeScriptRenderer.setProperty ${view} : ${name} = ${value}`);
        return this.viewUtil.setProperty(view, name, value);
    }

    addClass(view: NgView, name: string): void {
        traceLog(`NativeScriptRenderer.addClass ${name}`);
        this.viewUtil.addClass(view, name);
    }

    removeClass(view: NgView, name: string): void {
        traceLog(`NativeScriptRenderer.removeClass ${name}`);
        this.viewUtil.removeClass(view, name);
    }

    setStyle(view: NgView, styleName: string, value: any, _flags?: RendererStyleFlags2): void {
        traceLog(`NativeScriptRenderer.setStyle: ${styleName} = ${value}`);
        this.viewUtil.setStyle(view, styleName, value);
    }

    removeStyle(view: NgView, styleName: string, _flags?: RendererStyleFlags2): void {
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

class EmulatedRenderer extends NativeScriptRenderer {
    private contentAttr: string;
    private hostAttr: string;

    constructor(
        component: RendererType2,
        rootView: NgView,
        zone: NgZone,
        viewUtil: ViewUtil,
    ) {
        super(rootView, zone, viewUtil);

        const componentId = component.id.replace(ATTR_SANITIZER, "_");
        this.contentAttr = replaceNgAttribute(CONTENT_ATTR, componentId);
        this.hostAttr = replaceNgAttribute(HOST_ATTR, componentId);
        this.addStyles(component.styles, componentId);
    }

    applyToHost(view: NgView) {
        super.setAttribute(view, this.hostAttr, "");
    }

    appendChild(parent: any, newChild: NgView): void {
        super.appendChild(parent, newChild);
    }

    createElement(parent: any, name: string): NgView {
        const view = super.createElement(parent, name);

        // Set an attribute to the view to scope component-specific css.
        // The property name is pre-generated by Angular.
        super.setAttribute(view, this.contentAttr, "");

        return view;
    }

    private addStyles(styles: (string | any[])[], componentId: string) {
        styles.map(s => s.toString())
            .map(s => replaceNgAttribute(s, componentId))
            .forEach(addCss);
    }

}

function replaceNgAttribute(input: string, componentId: string): string {
    return input.replace(COMPONENT_REGEX, componentId);
}
