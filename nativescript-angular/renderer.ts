import {
    Inject, Injectable, Optional, NgZone,
    Renderer, RootRenderer, RenderComponentType, AnimationPlayer,
    ɵAnimationStyles, ɵAnimationKeyframe,
} from "@angular/core";
import { APP_ROOT_VIEW, DEVICE } from "./platform-providers";
import { isBlank } from "./lang-facade";
import { View } from "ui/core/view";
import { addCss } from "application";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { ViewUtil } from "./view-util";
import { NgView } from "./element-registry";
import { rendererLog as traceLog } from "./trace";
import { escapeRegexSymbols } from "utils/utils";
import { Device } from "platform";

import { NativeScriptAnimationDriver } from "./animation-driver";

// CONTENT_ATTR not exported from dom_renderer - we need it for styles application.
export const COMPONENT_VARIABLE = "%COMP%";
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;


@Injectable()
export class NativeScriptRootRenderer implements RootRenderer {
    private _viewUtil: ViewUtil;
    private _animationDriver: NativeScriptAnimationDriver;

    protected get animationDriver(): NativeScriptAnimationDriver {
        if (!this._animationDriver) {
            this._animationDriver = new NativeScriptAnimationDriver();
        }
        return this._animationDriver;
    }

    constructor(
        @Optional() @Inject(APP_ROOT_VIEW) private _rootView: View,
        @Inject(DEVICE) device: Device,
        private _zone: NgZone
    ) {
        this._viewUtil = new ViewUtil(device);
    }

    private _registeredComponents = new Map<string, NativeScriptRenderer>();

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
        let renderer = this._registeredComponents.get(componentProto.id);
        if (isBlank(renderer)) {
            renderer = new NativeScriptRenderer(this, componentProto,
                this.animationDriver, this._zone);
            this._registeredComponents.set(componentProto.id, renderer);
        }
        return renderer;
    }
}

@Injectable()
export class NativeScriptRenderer extends Renderer {
    private componentProtoId: string;
    private hasComponentStyles: boolean;

    private get viewUtil(): ViewUtil {
        return this.rootRenderer.viewUtil;
    }

    constructor(
        private rootRenderer: NativeScriptRootRenderer,
        private componentProto: RenderComponentType,
        private animationDriver: NativeScriptAnimationDriver,
        private zone: NgZone) {

        super();
        let stylesLength = this.componentProto.styles.length;
        this.componentProtoId = this.componentProto.id;
        for (let i = 0; i < stylesLength; i++) {
            this.hasComponentStyles = true;
            let cssString = this.componentProto.styles[i] + "";
            const realCSS = this.replaceNgAttribute(cssString, this.componentProtoId);
            addCss(realCSS);
        }
        traceLog("NativeScriptRenderer created");
    }

    private attrReplacer = new RegExp(escapeRegexSymbols(CONTENT_ATTR), "g");
    private attrSanitizer = /-/g;

    private replaceNgAttribute(input: string, componentId: string): string {
        return input.replace(this.attrReplacer,
            "_ng_content_" + componentId.replace(this.attrSanitizer, "_"));
    }

    renderComponent(componentProto: RenderComponentType): Renderer {
        return this.rootRenderer.renderComponent(componentProto);
    }

    selectRootElement(selector: string): NgView {
        traceLog("selectRootElement: " + selector);
        const rootView = <NgView><any>this.rootRenderer.rootView;
        rootView.nodeName = "ROOT";
        return rootView;
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

    attachViewAfter(anchorNode: NgView, viewRootNodes: NgView[]) {
        traceLog("NativeScriptRenderer.attachViewAfter: " + anchorNode.nodeName + " " + anchorNode);
        const parent = (<NgView>anchorNode.parent || anchorNode.templateParent);
        const insertPosition = this.viewUtil.getChildIndex(parent, anchorNode);

        viewRootNodes.forEach((node, index) => {
            const childIndex = insertPosition + index + 1;
            this.viewUtil.insertChild(parent, node, childIndex);
        });
    }

    detachView(viewRootNodes: NgView[]) {
        traceLog("NativeScriptRenderer.detachView");
        for (let i = 0; i < viewRootNodes.length; i++) {
            let node = viewRootNodes[i];
            this.viewUtil.removeChild(<NgView>node.parent, node);
        }
    }

    public destroyView(_hostElement: NgView, _viewAllNodes: NgView[]) {
        traceLog("NativeScriptRenderer.destroyView");
        // Seems to be called on component dispose only (router outlet)
        // TODO: handle this when we resolve routing and navigation.
    }

    setElementProperty(renderElement: NgView, propertyName: string, propertyValue: any) {
        traceLog("NativeScriptRenderer.setElementProperty " + renderElement + ": " +
            propertyName + " = " + propertyValue);
        this.viewUtil.setProperty(renderElement, propertyName, propertyValue);
    }

    setElementAttribute(renderElement: NgView, attributeName: string, attributeValue: string) {
        traceLog("NativeScriptRenderer.setElementAttribute " + renderElement + ": " +
            attributeName + " = " + attributeValue);
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

    setText(_renderNode: any, _text: string) {
        traceLog("NativeScriptRenderer.setText");
    }

    public createTemplateAnchor(parentElement: NgView): NgView {
        traceLog("NativeScriptRenderer.createTemplateAnchor");
        return this.viewUtil.createTemplateAnchor(parentElement);
    }

    public createElement(parentElement: NgView, name: string): NgView {
        traceLog("NativeScriptRenderer.createElement: " + name + " parent: " +
            parentElement + ", " + (parentElement ? parentElement.nodeName : "null"));
        return this.viewUtil.createView(name, parentElement, (view) => {
            // Set an attribute to the view to scope component-specific css.
            // The property name is pre-generated by Angular.
            if (this.hasComponentStyles) {
                const cssAttribute = this.replaceNgAttribute(CONTENT_ATTR, this.componentProtoId);
                view[cssAttribute] = true;
            }
        });
    }

    public createText(_parentElement: NgView, _value: string): NgView {
        traceLog("NativeScriptRenderer.createText");
        return this.viewUtil.createText();
    }

    public listen(renderElement: NgView, eventName: string, callback: Function): Function {
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

    public listenGlobal(_target: string, _eventName: string, _callback: Function): Function {
        throw new Error("NativeScriptRenderer.listenGlobal() - Not implemented.");
    }

    public animate(
        element: any,
        startingStyles: ɵAnimationStyles,
        keyframes: ɵAnimationKeyframe[],
        duration: number,
        delay: number,
        easing: string
    ): AnimationPlayer {
        let player = this.animationDriver.animate(
            element, startingStyles, keyframes, duration, delay, easing);
        return player;
    }
}
