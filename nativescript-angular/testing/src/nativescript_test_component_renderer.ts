import { Injectable } from '@angular/core';
import { TestComponentRenderer } from '@angular/core/testing';
import { ProxyViewContainer } from '@nativescript/core';
import { testingRootView } from './test-root-view';

/**
 * A NativeScript based implementation of the TestComponentRenderer.
 */
@Injectable()
export class NativeScriptTestComponentRenderer extends TestComponentRenderer {
	insertRootElement(rootElId: string) {
		const layout = new ProxyViewContainer();
		layout.id = rootElId;

		const rootLayout = testingRootView();
		rootLayout.addChild(layout);
	}
}
