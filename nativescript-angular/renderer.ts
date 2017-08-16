import {
    Inject, Injectable, Optional, NgZone,
    Renderer2, RendererFactory2, RendererType2,
    RendererStyleFlags2, ViewEncapsulation,
} from "@angular/core";

import { Device } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";
import { addCss } from "tns-core-modules/application";
import { topmost } from "tns-core-modules/ui/frame";
import { profile } from "tns-core-modules/profiling";

import { APP_ROOT_VIEW, DEVICE, getRootPage } from "./platform-providers";
import { isBlank } from "./lang-facade";
import { ViewUtil } from "./view-util";
import { NgView, NgElement, InvisibleNode, ElementReference, isDetachedElement } from "./element-registry";
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

        if (type.encapsulation === ViewEncapsulation.None) {
            type.styles.map(s => s.toString()).forEach(addStyleToCss);
            renderer = this.defaultRenderer;
        } else {
            renderer = new EmulatedRenderer(type, this.rootNgView, this.zone, this.viewUtil);
            (<EmulatedRenderer>renderer).applyToHost(element);
        }

        this.componentRenderers.set(type.id, renderer);
        return renderer;
    }
}

export class NativeScriptRenderer extends Renderer2 {
    data: { [key: string]: any } = Object.create(null);

    constructor(
        private rootView: NgElement,
        private zone: NgZone,
        private viewUtil: ViewUtil
    ) {
        super();
        traceLog("NativeScriptRenderer created");
    }

    @profile
    appendChild(parent: NgElement, newChild: NgElement): void {
        traceLog(`NativeScriptRenderer.appendChild child: ${newChild} parent: ${parent}`);
        this.viewUtil.insertChild(parent, newChild);
    }

    @profile
    insertBefore(parent: NgElement, newChild: NgElement, { previous, next }: ElementReference): void {
        traceLog(`NativeScriptRenderer.insertBefore child: ${newChild} ` +
        `parent: ${parent} previous: ${previous} next: ${next}`);
        this.viewUtil.insertChild(parent, newChild, previous, next);
    }

    @profile
    removeChild(parent: any, oldChild: NgElement): void {
        traceLog(`NativeScriptRenderer.removeChild child: ${oldChild} parent: ${parent}`);
        this.viewUtil.removeChild(parent, oldChild);
    }

    @profile
    selectRootElement(selector: string): NgView {
        traceLog("NativeScriptRenderer.selectRootElement: " + selector);
        return this.rootView;
    }

    @profile
    parentNode(node: NgView): any {
        traceLog(`NativeScriptRenderer.parentNode for node: ${node}`);
        return node.parent || node.templateParent;
    }

    @profile
    nextSibling(node: NgElement): ElementReference {
        traceLog(`NativeScriptRenderer.nextSibling of ${node} is ${node.nextSibling}`);

        let next = node.nextSibling;
        while (next && isDetachedElement(next)) {
            next = next.nextSibling;
        }

        return {
            previous: node,
            next,
        };
    }

    @profile
    createComment(_value: any): InvisibleNode {
        traceLog(`NativeScriptRenderer.createComment ${_value}`);
        return this.viewUtil.createComment();
    }

    @profile
    createElement(name: any, _namespace: string): NgElement {
        traceLog(`NativeScriptRenderer.createElement: ${name}`);
        return this.viewUtil.createView(name);
    }

    @profile
    createText(_value: string): InvisibleNode {
        traceLog(`NativeScriptRenderer.createText ${_value}`);
        return this.viewUtil.createText();
    }

    @profile
    createViewRoot(hostElement: NgView): NgView {
        traceLog(`NativeScriptRenderer.createViewRoot ${hostElement.nodeName}`);
        return hostElement;
    }

    @profile
    projectNodes(parentElement: NgElement, nodes: NgElement[]): void {
        traceLog("NativeScriptRenderer.projectNodes");
        nodes.forEach((node) => this.viewUtil.insertChild(parentElement, node));
    }

    @profile
    destroy() {
        traceLog("NativeScriptRenderer.destroy");
        // Seems to be called on component dispose only (router outlet)
        // TODO: handle this when we resolve routing and navigation.
    }

    @profile
    setAttribute(view: NgElement, name: string, value: string, namespace?: string) {
        traceLog(`NativeScriptRenderer.setAttribute ${view} : ${name} = ${value}, namespace: ${namespace}`);
        return this.viewUtil.setProperty(view, name, value, namespace);
    }

    @profile
    removeAttribute(_el: NgElement, _name: string): void {
        traceLog(`NativeScriptRenderer.removeAttribute ${_el}: ${_name}`);
    }

    @profile
    setProperty(view: any, name: string, value: any) {
        traceLog(`NativeScriptRenderer.setProperty ${view} : ${name} = ${value}`);
        return this.viewUtil.setProperty(view, name, value);
    }

    @profile
    addClass(view: NgElement, name: string): void {
        traceLog(`NativeScriptRenderer.addClass ${name}`);
        this.viewUtil.addClass(view, name);
    }

    @profile
    removeClass(view: NgElement, name: string): void {
        traceLog(`NativeScriptRenderer.removeClass ${name}`);
        this.viewUtil.removeClass(view, name);
    }

    @profile
    setStyle(view: NgElement, styleName: string, value: any, _flags?: RendererStyleFlags2): void {
        traceLog(`NativeScriptRenderer.setStyle: ${styleName} = ${value}`);
        this.viewUtil.setStyle(view, styleName, value);
    }

    @profile
    removeStyle(view: NgElement, styleName: string, _flags?: RendererStyleFlags2): void {
        traceLog("NativeScriptRenderer.removeStyle: ${styleName}");
        this.viewUtil.removeStyle(view, styleName);
    }

    // Used only in debug mode to serialize property changes to comment nodes,
    // such as <template> placeholders.
    @profile
    setBindingDebugInfo(renderElement: NgElement, propertyName: string, propertyValue: string): void {
        traceLog("NativeScriptRenderer.setBindingDebugInfo: " + renderElement + ", " +
            propertyName + " = " + propertyValue);
    }

    @profile
    setElementDebugInfo(renderElement: any, _info: any /*RenderDebugInfo*/): void {
        traceLog("NativeScriptRenderer.setElementDebugInfo: " + renderElement);
    }

    @profile
    invokeElementMethod(_renderElement: NgElement, methodName: string, args: Array<any>) {
        traceLog("NativeScriptRenderer.invokeElementMethod " + methodName + " " + args);
    }

    @profile
    setValue(_renderNode: any, _value: string) {
        traceLog(
            `NativeScriptRenderer.setValue ` +
            `renderNode: ${_renderNode}, value: ${_value}`
        );
    }

    @profile
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

    applyToHost(view: NgElement) {
        super.setAttribute(view, this.hostAttr, "");
    }

    appendChild(parent: any, newChild: NgElement): void {
        super.appendChild(parent, newChild);
    }

    createElement(parent: any, name: string): NgElement {
        const view = super.createElement(parent, name);

        // Set an attribute to the view to scope component-specific css.
        // The property name is pre-generated by Angular.
        super.setAttribute(view, this.contentAttr, "");

        return view;
    }

    @profile
    private addStyles(styles: (string | any[])[], componentId: string) {
        styles.map(s => s.toString())
            .map(s => replaceNgAttribute(s, componentId))
            .forEach(addStyleToCss);
    }
}

// tslint:disable-next-line
const addStyleToCss = profile('"renderer".addStyleToCss', function addStyleToCss(style: string): void {
    addCss(style);
});

function replaceNgAttribute(input: string, componentId: string): string {
    return input.replace(COMPONENT_REGEX, componentId);
}
