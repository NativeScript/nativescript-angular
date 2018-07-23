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
    private frames: { frame: Frame, name: string, rootOutlet: string }[] = [];

    // Return the topmost frame.
    // TabView with frames scenario: topmost() will return the root TabViewItem frame,
    // which could be the wrong topmost frame (modal with nested frame e.g.):
    // TabViewItem -> Frame -> Modal -> Frame2 -> Frame2-Navigation
    getFrame(): Frame {
        let topmostFrame = topmost();
        const { cachedFrame, cachedFrameRootOutlet } = this.findFrame(topmostFrame);

        if (cachedFrame && cachedFrameRootOutlet) {
            const topmostFrameByOutlet = this.getTopmostFrameByOutlet(cachedFrameRootOutlet);

            if (topmostFrameByOutlet && topmostFrameByOutlet !== cachedFrame) {
                topmostFrame = topmostFrameByOutlet;
            }
        }

        return topmostFrame;
    }

    addFrame(frame: Frame, name: string, rootOutlet: string) {
        this.frames.push({ frame: frame, name: name, rootOutlet: rootOutlet });
    }

    removeFrame(frame: Frame) {
        this.frames = this.frames.filter(currentFrame => currentFrame.frame !== frame);
    }

    containsOutlet(name: string) {
        let nameFound = false;

        for (let i = 0; i < this.frames.length; i++) {
            const currentFrame = this.frames[i];

            if (name && currentFrame.name === name) {
                nameFound = true;
                break;
            }
        }

        return nameFound;
    }

    findFrame(frame: Frame) {
        let cachedFrame;
        let cachedFrameRootOutlet;

        for (let i = 0; i < this.frames.length; i++) {
            const currentFrame = this.frames[i];

            if (currentFrame.frame === frame) {
                cachedFrame = currentFrame;
                cachedFrameRootOutlet = currentFrame.rootOutlet;
                break;
            }
        }

        return { cachedFrame, cachedFrameRootOutlet };
    }

    // Return the latest navigated frame from the given outlet branch.
    private getTopmostFrameByOutlet(rootOutlet: string): Frame {
        let frame: Frame;

        for (let i = this.frames.length - 1; i > 0; i--) {
            const currentFrame = this.frames[i];

            if (currentFrame.rootOutlet === rootOutlet) {
                frame = currentFrame.frame;
                break;
            }
        }

        return frame;
    }
}
