import {topmost} from 'ui/frame';
import {Page} from 'ui/page';
import {provide, Provider, OpaqueToken} from '@angular/core/src/di';
import {device} from "platform";
import {NativeScriptAnimationDriver} from './animation-driver';
import {AnimationDriver} from "@angular/core/src/animation/animation_driver";

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

export const defaultAnimationDriverProvider = provide(AnimationDriver, { useClass: NativeScriptAnimationDriver });