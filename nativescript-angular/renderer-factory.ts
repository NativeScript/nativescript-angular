import { Inject, Injectable, RendererFactory2, Optional, NgZone, RendererType2, ViewEncapsulation } from '@angular/core';
import { View, getViewById, Application, profile, Device } from '@nativescript/core';
import { APP_ROOT_VIEW, getRootPage } from './platform-providers';
import { ViewUtil } from './view-util';
import { NgView, InvisibleNode } from './element-registry';
import { NativeScriptDebug } from './trace';
import { NativeScriptRenderer } from './renderer';
import { EmulatedRenderer } from './renderer-emulated';

const addStyleToCss = profile('"renderer".addStyleToCss', function addStyleToCss(style: string): void {
	Application.addCss(style);
});

@Injectable()
export class NativeScriptRendererFactory implements RendererFactory2 {
	componentRenderers = new Map<string, NativeScriptRenderer>();
	viewUtil: ViewUtil;
	defaultRenderer: NativeScriptRenderer;
	rootNgView: NgView;

	constructor(@Optional() @Inject(APP_ROOT_VIEW) rootView: View, private zone: NgZone) {
		this.viewUtil = new ViewUtil(Device);
		this.setRootNgView(rootView);
		this.defaultRenderer = new NativeScriptRenderer(this.rootNgView, zone, this.viewUtil);
	}

	private setRootNgView(rootView: any) {
		if (!rootView) {
			rootView = getRootPage();
		}

		rootView.nodeName = 'NONE';
		this.rootNgView = rootView;
	}

	createRenderer(element: any, type: RendererType2): NativeScriptRenderer {
		if (!element || !type) {
			return this.defaultRenderer;
		}

		let renderer = this.componentRenderers.get(type.id);
		if (renderer) {
			if (renderer instanceof EmulatedRenderer) {
				renderer.applyToHost(element);
			}

			return renderer;
		}

		if (type.encapsulation === ViewEncapsulation.None) {
			type.styles.map((s) => s.toString()).forEach(addStyleToCss);
			renderer = this.defaultRenderer;
		} else {
			renderer = new EmulatedRenderer(type, this.rootNgView, this.zone, this.viewUtil);
			(<EmulatedRenderer>renderer).applyToHost(element);
		}

		this.componentRenderers.set(type.id, renderer);
		return renderer;
	}

	ngOnDestroy(): void {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.rendererLog(`NativeScriptRendererFactory.ngOnDestroy()`);
		}

		while (this.rootNgView && this.rootNgView.firstChild) {
			this.viewUtil.removeChild(this.rootNgView, this.rootNgView.firstChild);
		}
	}
}
