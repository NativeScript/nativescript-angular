import { InjectionToken, Injectable } from "@angular/core";

import { topmost, Frame } from "tns-core-modules/ui/frame";
import { View } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page";
import { device, Device } from "tns-core-modules/platform";

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

    const frame = topmost();
    if (frame && frame.currentPage) {
        return frame.currentPage;
    }

    return null;
}

export const defaultPageProvider = { provide: Page, useFactory: getDefaultPage };

// Use an exported function to make the AoT compiler happy.
export function getDefaultFrame(): Frame {
    return topmost();
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

@Injectable()
export class FrameService {
    // TODO: Add any methods that are needed to handle frame/page navigation
    getFrame(): Frame {
        return topmost();
    }
}
