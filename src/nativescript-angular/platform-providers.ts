import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import {provide, Provider, OpaqueToken} from 'angular2/src/core/di';
import {Device, ScreenMetrics, device, screen} from "platform";

export const APP_ROOT_VIEW = new OpaqueToken('App Root View');
export const DEVICE = new OpaqueToken('platfrom device');

export const defaultPageProvider = provide(Page, { useFactory: getDefaultPage });

export function getDefaultPage(): Page {
    const frame = topmost();
    if (frame) {
        return frame.currentPage;
    } else {
        return null;
    }
}

export const defaultDeviceProvider = provide(DEVICE, { useValue: device });

