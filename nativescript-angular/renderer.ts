import { Inject, Injectable, Optional, NgZone, Renderer2, RendererFactory2, RendererType2, RendererStyleFlags2, ViewEncapsulation } from '@angular/core';

import { View, getViewById, profile } from '@nativescript/core';

import { ViewUtil } from './view-util';
import { NgView, InvisibleNode } from './element-registry';
import { NativeScriptDebug } from './trace';

export interface ElementReference {
	previous: NgView;
	next: NgView;
}

@Injectable()
export class NativeScriptRenderer extends Renderer2 {
	data: { [key: string]: any } = Object.create(null);

	constructor(private rootView: NgView, private zone: NgZone, private viewUtil: ViewUtil) {
		super();
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog('NativeScriptRenderer created');
		}
	}

	@profile
	appendChild(parent: NgView, newChild: NgView): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.appendChild child: ${newChild} parent: ${parent}`);
		}
		this.viewUtil.insertChild(parent, newChild);
	}

	@profile
	insertBefore(parent: NgView, newChild: NgView, { previous, next }: ElementReference): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.insertBefore child: ${newChild} ` + `parent: ${parent} previous: ${previous} next: ${next}`);
		}
		this.viewUtil.insertChild(parent, newChild, previous, next);
	}

	@profile
	removeChild(parent: any, oldChild: NgView): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.removeChild child: ${oldChild} parent: ${parent}`);
		}
		this.viewUtil.removeChild(parent, oldChild);
	}

	@profile
	selectRootElement(selector: string): NgView {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.selectRootElement: ${selector}`);
		}
		if (selector && selector[0] === '#') {
			const result = getViewById(this.rootView, selector.slice(1));
			return (result || this.rootView) as NgView;
		}
		return this.rootView;
	}

	@profile
	parentNode(node: NgView): any {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.parentNode for node: ${node} is ${node.parentNode}`);
		}
		return node.parentNode;
	}

	@profile
	nextSibling(node: NgView): ElementReference {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.nextSibling of ${node} is ${node.nextSibling}`);
		}

		return {
			previous: node,
			next: node.nextSibling,
		};
	}

	@profile
	createComment(_value: any): InvisibleNode {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.createComment ${_value}`);
		}
		return this.viewUtil.createComment();
	}

	@profile
	createElement(name: any, _namespace: string): NgView {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.createElement: ${name}`);
		}
		return this.viewUtil.createView(name);
	}

	@profile
	createText(_value: string): InvisibleNode {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.createText ${_value}`);
		}
		return this.viewUtil.createText();
	}

	@profile
	createViewRoot(hostElement: NgView): NgView {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.createViewRoot ${hostElement.nodeName}`);
		}
		return hostElement;
	}

	@profile
	projectNodes(parentElement: NgView, nodes: NgView[]): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog('NativeScriptRenderer.projectNodes');
		}
		nodes.forEach((node) => this.viewUtil.insertChild(parentElement, node));
	}

	@profile
	destroy() {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog('NativeScriptRenderer.destroy');
		}
		// Seems to be called on component dispose only (router outlet)
		// TODO: handle this when we resolve routing and navigation.
	}

	@profile
	setAttribute(view: NgView, name: string, value: string, namespace?: string) {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.setAttribute ${view} : ${name} = ${value}, namespace: ${namespace}`);
		}
		return this.viewUtil.setProperty(view, name, value, namespace);
	}

	@profile
	removeAttribute(_el: NgView, _name: string): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.removeAttribute ${_el}: ${_name}`);
		}
	}

	@profile
	setProperty(view: any, name: string, value: any) {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.setProperty ${view} : ${name} = ${value}`);
		}
		return this.viewUtil.setProperty(view, name, value);
	}

	@profile
	addClass(view: NgView, name: string): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.addClass ${name}`);
		}
		this.viewUtil.addClass(view, name);
	}

	@profile
	removeClass(view: NgView, name: string): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.removeClass ${name}`);
		}
		this.viewUtil.removeClass(view, name);
	}

	@profile
	setStyle(view: NgView, styleName: string, value: any, _flags?: RendererStyleFlags2): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.setStyle: ${styleName} = ${value}`);
		}
		this.viewUtil.setStyle(view, styleName, value);
	}

	@profile
	removeStyle(view: NgView, styleName: string, _flags?: RendererStyleFlags2): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog('NativeScriptRenderer.removeStyle: ${styleName}');
		}
		this.viewUtil.removeStyle(view, styleName);
	}

	// Used only in debug mode to serialize property changes to comment nodes,
	// such as <template> placeholders.
	@profile
	setBindingDebugInfo(renderElement: NgView, propertyName: string, propertyValue: string): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.setBindingDebugInfo: ${renderElement}, ${propertyName} = ${propertyValue}`);
		}
	}

	@profile
	setElementDebugInfo(renderElement: any, _info: any /*RenderDebugInfo*/): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.setElementDebugInfo: ${renderElement}`);
		}
	}

	@profile
	invokeElementMethod(_renderElement: NgView, methodName: string, args: Array<any>) {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.invokeElementMethod ${methodName} ${args}`);
		}
	}

	@profile
	setValue(_renderNode: any, _value: string) {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.setValue renderNode: ${_renderNode}, value: ${_value}`);
		}
	}

	@profile
	listen(renderElement: any, eventName: string, callback: (event: any) => boolean): () => void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRenderer.listen: ${eventName}`);
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
