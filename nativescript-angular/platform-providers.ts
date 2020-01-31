import { InjectionToken, Injectable, OnDestroy } from "@angular/core";

import { Frame, NavigatedData } from "tns-core-modules/ui/frame";
import { View } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page";
import { device, Device } from "tns-core-modules/platform";
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

@Injectable()
export class FrameService {
    // TODO: Add any methods that are needed to handle frame/page navigation
    getFrame(): Frame {
        let topmostFrame = Frame.topmost();
        return topmostFrame;
    }
}

@Injectable()
export class PageService implements OnDestroy {
    private _inPage$ = new BehaviorSubject<boolean>(false);
    private _pageEvents$ = new Subject<NavigatedData>();

    get inPage(): boolean { return this._inPage$.value; }
    get inPage$(): Observable<boolean> { return this._inPage$.pipe(distinctUntilChanged()); }
    get pageEvents$(): Observable<NavigatedData> { return this._pageEvents$.asObservable(); }
    constructor(public page: Page) {
        if (this.page) {
            this.page.on("navigatedFrom", this.pageEvent, this);
            this.page.on("navigatedTo", this.pageEvent, this);
            this.page.on("navigatingFrom", this.pageEvent, this);
            this.page.on("navigatingTo", this.pageEvent, this);
        }
    }

    ngOnDestroy() {
        if (this.page) {
            this.page.off("navigatedFrom", this.pageEvent, this);
            this.page.off("navigatedTo", this.pageEvent, this);
            this.page.off("navigatingFrom", this.pageEvent, this);
            this.page.off("navigatingTo", this.pageEvent, this);
        }
        this._inPage$.complete();
        this._pageEvents$.complete();
    }

    private pageEvent(evt: NavigatedData) {
        this._pageEvents$.next(evt);
        switch (evt.eventName) {
            case "navigatedTo":
                this._inPage$.next(true);
                break;
            case "navigatedFrom":
                this._inPage$.next(false);
                break;
            default:
        }
    }
}
