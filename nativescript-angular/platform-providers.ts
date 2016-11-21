import { topmost, Frame } from 'ui/frame';
import { Page } from 'ui/page';
import { OpaqueToken } from '@angular/core';
import { device } from "platform";
import * as platform from "platform";

export const APP_ROOT_VIEW = new OpaqueToken('App Root View');
export const DEVICE = new OpaqueToken('platfrom device');
export const PAGE_FACTORY = new OpaqueToken('page factory');

//Work around a TS bug requiring an import of platform.Device without using it
if (global.___TS_UNUSED) {
    () => {
        return platform;
    }
}

export function getDefaultPage(): Page {
    const frame = topmost();
    if (frame) {
        return frame.currentPage;
    } else {
        return null;
    }
}
export const defaultPageProvider = { provide: Page, useFactory: getDefaultPage };

export const defaultFrameProvider = { provide: Frame, useFactory: topmost };

export const defaultDeviceProvider = { provide: DEVICE, useValue: device };

export type PageFactory = (options: PageFactoryOptions) => Page;
export interface PageFactoryOptions {
    isBootstrap?: boolean,
    isLivesync?:boolean,
    isModal?: boolean,
    isNavigation?: boolean,
    componentType?: any
}
export const defaultPageFactory: PageFactory = function (_opts: PageFactoryOptions) {
    return new Page();
}
export const defaultPageFactoryProvider = { provide: PAGE_FACTORY, useValue: defaultPageFactory };
