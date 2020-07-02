import { InjectionToken, Injectable, OnDestroy } from "@angular/core";

import { Frame, NavigatedData } from "@nativescript/core/ui/frame";
import { View } from "@nativescript/core/ui/core/view";
import { Page } from "@nativescript/core/ui/page";
import { device, Device } from "@nativescript/core/platform";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export const APP_ROOT_VIEW = new InjectionToken<View>("App Root View");
export const DEVICE = new InjectionToken<Device>("platform device");
export const PAGE_FACTORY = new InjectionToken<PageFactory>("page factory");

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
export function getDefaultDevice(): Device {
    return device;
}

export const defaultDeviceProvider = { provide: DEVICE, useFactory: getDefaultDevice };

export type PageFactory = (options: PageFactoryOptions) => Page;
export interface PageFactoryOptions {
    isBootstrap?: boolean;
    isLivesync?: boolean;
    isModal?: boolean;
    isNavigation?: boolean;
    componentType?: any;
}
export const defaultPageFactory: PageFactory = function (_opts: PageFactoryOptions) {
    return new Page();
};
export const defaultPageFactoryProvider = { provide: PAGE_FACTORY, useValue: defaultPageFactory };
