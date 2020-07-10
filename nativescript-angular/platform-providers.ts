import { InjectionToken, Injectable, OnDestroy } from '@angular/core';

import { Frame, View, Page, IDevice, Device } from '@nativescript/core';

export const APP_ROOT_VIEW = new InjectionToken<View>('NativeScriptAppRootView');
export const DEVICE = new InjectionToken<IDevice>('NativeScriptPlatformDevice');

export type PageFactory = (options: PageFactoryOptions) => Page;
export interface PageFactoryOptions {
	isBootstrap?: boolean;
	isLivesync?: boolean;
	isModal?: boolean;
	isNavigation?: boolean;
	componentType?: any;
}
export const PAGE_FACTORY = new InjectionToken<PageFactory>('NativeScriptPageFactory');
export const defaultPageFactory: PageFactory = function (_opts: PageFactoryOptions) {
	return new Page();
};
export const defaultPageFactoryProvider = { provide: PAGE_FACTORY, useValue: defaultPageFactory };

let _rootPageRef: WeakRef<Page>;

export function setRootPage(page: Page): void {
	_rootPageRef = new WeakRef(page);
}

export function getRootPage(): Page {
	return _rootPageRef && _rootPageRef.get();
}

// Use an exported function to make the AoT compiler happy.
export function getDefaultPage(): Page {
	const rootPage = getRootPage();
	if (rootPage instanceof Page) {
		return rootPage;
	}

	const frame = Frame.topmost();
	if (frame && frame.currentPage) {
		return frame.currentPage;
	}

	return null;
}

export const defaultPageProvider = { provide: Page, useFactory: getDefaultPage };

// Use an exported function to make the AoT compiler happy.
export function getDefaultFrame(): Frame {
	return Frame.topmost();
}

export const defaultFrameProvider = { provide: Frame, useFactory: getDefaultFrame };

// Use an exported function to make the AoT compiler happy.
export function getDefaultDevice(): IDevice {
	return Device;
}

export const defaultDeviceProvider = { provide: DEVICE, useFactory: getDefaultDevice };
