import { topmost, Frame } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { OpaqueToken } from "@angular/core";
import { device, Device } from "tns-core-modules/platform";
import * as platform from "tns-core-modules/platform";

export const APP_ROOT_VIEW = new OpaqueToken("App Root View");
export const DEVICE = new OpaqueToken("platfrom device");
export const PAGE_FACTORY = new OpaqueToken("page factory");

// Work around a TS bug requiring an import of platform.Device without using it
if ((<any>global).___TS_UNUSED) {
    (() => {
        return platform;
    })();
}

let _rootPageRef: WeakRef<Page>;

export function setRootPage(page: Page): void {
    _rootPageRef = new WeakRef(page);
}

export function getRootPage(): Page {
    return _rootPageRef && _rootPageRef.get();
}

// Use an exported function to make the AoT compiler happy.
export function getDefaultPage(): Page {
    const frame = topmost();
    return getRootPage() || (frame && frame.currentPage);
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
