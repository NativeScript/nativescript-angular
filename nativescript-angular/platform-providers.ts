import {topmost, Frame} from 'ui/frame';
import {Page} from 'ui/page';
import {Provider, OpaqueToken} from '@angular/core';
import {device, Device} from "platform";
import {NativeScriptAnimationDriver} from './animation-driver';

export const APP_ROOT_VIEW = new OpaqueToken('App Root View');
export const DEVICE = new OpaqueToken('platfrom device');

export const defaultPageProvider = {provide: Page, useFactory: getDefaultPage};

export function getDefaultPage(): Page {
    const frame = topmost();
    if (frame) {
        return frame.currentPage;
    } else {
        return null;
    }
}

export const defaultFrameProvider = {provide: Frame, useFactory: topmost};

export const defaultDeviceProvider = {provide: DEVICE, useValue: device};
