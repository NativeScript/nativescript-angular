import {
    Inject, Injectable, Optional, NgZone,
    Renderer2, RendererFactory2, RendererType2,
    RendererStyleFlags2, ViewEncapsulation,
} from "@angular/core";

import { Device } from "tns-core-modules/platform";
import { View, getViewById } from "tns-core-modules/ui/core/view";
import { addCss } from "tns-core-modules/application";
import { profile } from "tns-core-modules/profiling";

import { APP_ROOT_VIEW, DEVICE, getRootPage } from "./platform-providers";
import { ViewUtil } from "./view-util";
import { NgView, InvisibleNode } from "./element-registry";
import { rendererLog as traceLog, isLogEnabled } from "./trace";

// CONTENT_ATTR not exported from NativeScript_renderer - we need it for styles application.
const COMPONENT_REGEX = /%COMP%/g;
export const COMPONENT_VARIABLE = "%COMP%";
export const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
const ATTR_SANITIZER = /-/g;

export interface ElementReference {
    previous: NgView;
    next: NgView;
}

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
            rootView = getRootPage();
        }

        rootView.nodeName = "NONE";
        this.rootNgView = rootView;
    }

    createRenderer(element: any, type: RendererType2): NativeScriptRenderer {
        if (!element || !type) {
            return this.defaultRenderer;
        }

        let renderer: NativeScriptRenderer = this.componentRenderers.get(type.id);
        if (renderer) {
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
        private rootView: NgView,
        private zone: NgZone,
        private viewUtil: ViewUtil
    ) {
        super();
        if (isLogEnabled()) {
            traceLog("NativeScriptRenderer created");
        }
    }

    @profile
    appendChild(parent: NgView, newChild: NgView): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.appendChild child: ${newChild} parent: ${parent}`);
        }
        this.viewUtil.insertChild(parent, newChild);
    }

    @profile
    insertBefore(parent: NgView, newChild: NgView, { previous, next }: ElementReference): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.insertBefore child: ${newChild} ` +
            `parent: ${parent} previous: ${previous} next: ${next}`);
        }
        this.viewUtil.insertChild(parent, newChild, previous, next);
    }

    @profile
    removeChild(parent: any, oldChild: NgView): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.removeChild child: ${oldChild} parent: ${parent}`);
        }
        this.viewUtil.removeChild(parent, oldChild);
    }

    @profile
    selectRootElement(selector: string): NgView {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.selectRootElement: ${selector}`);
        }
        if (selector && selector[0] === "#") {
            const result = getViewById(this.rootView, selector.slice(1));
            return (result || this.rootView) as NgView;
        }
        return this.rootView;
    }

    @profile
    parentNode(node: NgView): any {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.parentNode for node: ${node}`);
        }
        return node.parentNode;
    }

    @profile
    nextSibling(node: NgView): ElementReference {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.nextSibling of ${node} is ${node.nextSibling}`);
        }

        return {
            previous: node,
            next: node.nextSibling,
        };
    }

    @profile
    createComment(_value: any): InvisibleNode {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.createComment ${_value}`);
        }
        return this.viewUtil.createComment();
    }

    @profile
    createElement(name: any, _namespace: string): NgView {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.createElement: ${name}`);
        }
        return this.viewUtil.createView(name);
    }

    @profile
    createText(_value: string): InvisibleNode {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.createText ${_value}`);
        }
        return this.viewUtil.createText();
    }

    @profile
    createViewRoot(hostElement: NgView): NgView {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.createViewRoot ${hostElement.nodeName}`);
        }
        return hostElement;
    }

    @profile
    projectNodes(parentElement: NgView, nodes: NgView[]): void {
        if (isLogEnabled()) {
            traceLog("NativeScriptRenderer.projectNodes");
        }
        nodes.forEach((node) => this.viewUtil.insertChild(parentElement, node));
    }

    @profile
    destroy() {
        if (isLogEnabled()) {
            traceLog("NativeScriptRenderer.destroy");
        }
        // Seems to be called on component dispose only (router outlet)
        // TODO: handle this when we resolve routing and navigation.
    }

    @profile
    setAttribute(view: NgView, name: string, value: string, namespace?: string) {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.setAttribute ${view} : ${name} = ${value}, namespace: ${namespace}`);
        }
        return this.viewUtil.setProperty(view, name, value, namespace);
    }

    @profile
    removeAttribute(_el: NgView, _name: string): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.removeAttribute ${_el}: ${_name}`);
        }
    }

    @profile
    setProperty(view: any, name: string, value: any) {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.setProperty ${view} : ${name} = ${value}`);
        }
        return this.viewUtil.setProperty(view, name, value);
    }

    @profile
    addClass(view: NgView, name: string): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.addClass ${name}`);
        }
        this.viewUtil.addClass(view, name);
    }

    @profile
    removeClass(view: NgView, name: string): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.removeClass ${name}`);
        }
        this.viewUtil.removeClass(view, name);
    }

    @profile
    setStyle(view: NgView, styleName: string, value: any, _flags?: RendererStyleFlags2): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.setStyle: ${styleName} = ${value}`);
        }
        this.viewUtil.setStyle(view, styleName, value);
    }

    @profile
    removeStyle(view: NgView, styleName: string, _flags?: RendererStyleFlags2): void {
        if (isLogEnabled()) {
            traceLog("NativeScriptRenderer.removeStyle: ${styleName}");
        }
        this.viewUtil.removeStyle(view, styleName);
    }

    // Used only in debug mode to serialize property changes to comment nodes,
    // such as <template> placeholders.
    @profile
    setBindingDebugInfo(renderElement: NgView, propertyName: string, propertyValue: string): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.setBindingDebugInfo: ${renderElement}, ${propertyName} = ${propertyValue}`);
        }
    }

    @profile
    setElementDebugInfo(renderElement: any, _info: any /*RenderDebugInfo*/): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.setElementDebugInfo: ${renderElement}`);
        }
    }

    @profile
    invokeElementMethod(_renderElement: NgView, methodName: string, args: Array<any>) {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.invokeElementMethod ${methodName} ${args}`);
        }
    }

    @profile
    setValue(_renderNode: any, _value: string) {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.setValue renderNode: ${_renderNode}, value: ${_value}`);
        }
    }

    @profile
    listen(renderElement: any, eventName: string, callback: (event: any) => boolean):
        () => void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptRenderer.listen: ${eventName}`);
        }
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
