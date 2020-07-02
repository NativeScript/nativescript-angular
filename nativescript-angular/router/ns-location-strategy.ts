import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree, ActivatedRouteSnapshot, Params } from '@angular/router';
import { Frame } from '@nativescript/core/ui/frame';
import { NativeScriptDebug } from '../trace';
import { isPresent } from '../lang-facade';
import { FrameService } from '../frame.service';
import { Outlet, NavigationOptions, LocationState, defaultNavOptions } from './ns-location-utils';

@Injectable({
  providedIn: 'root'
})
export class NSLocationStrategy extends LocationStrategy {
    private outlets: Array<Outlet> = [];
    private currentOutlet: Outlet;

    private popStateCallbacks = new Array<(_: any) => any>();
    private _currentNavigationOptions: NavigationOptions;
    private currentUrlTree: UrlTree;

    public _modalNavigationDepth = 0;

    constructor(private frameService: FrameService) {
        super();
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.constructor()');
        }
    }

    path(): string {
        if (!this.currentUrlTree) {
            return '/';
        }

        const state = this.currentOutlet && this.currentOutlet.peekState();
        if (!state) {
            return '/';
        }

        let tree = this.currentUrlTree;
        let changedOutlet = this.getSegmentGroupByOutlet(this.currentOutlet);

        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (state.isRootSegmentGroup) {
            tree.root = state.segmentGroup;
        } else if (changedOutlet) {
            this.updateSegmentGroup(tree.root, changedOutlet, state.segmentGroup);
        }

        const urlSerializer = new DefaultUrlSerializer();
        tree.queryParams = state.queryParams;
        const url = urlSerializer.serialize(tree);
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.path(): ' + url);
        }
        return url;
    }

    prepareExternalUrl(internal: string): string {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.prepareExternalUrl() internal: ' + internal);
        }
        return internal;
    }

    pushState(state: any, title: string, url: string, queryParams: string): void {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.pushState state: ' +
                `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
        }
        this.pushStateInternal(state, title, url, queryParams);
    }

    pushStateInternal(state: any, title: string, url: string, queryParams: string): void {
        const urlSerializer = new DefaultUrlSerializer();
        this.currentUrlTree = urlSerializer.parse(url);
        const urlTreeRoot = this.currentUrlTree.root;

        // Handle case where the user declares a component at path "/".
        // The url serializer doesn't parse this url as having a primary outlet.
        if (!Object.keys(urlTreeRoot.children).length) {
            const segmentGroup = this.currentUrlTree && this.currentUrlTree.root;
            const outletKey = this.getOutletKey(this.getSegmentGroupFullPath(segmentGroup), 'primary');
            const outlet = this.findOutlet(outletKey);

            if (outlet && this.updateStates(outlet, segmentGroup, this.currentUrlTree.queryParams)) {
                this.currentOutlet = outlet; // If states updated
            } else if (!outlet) {
                // tslint:disable-next-line:max-line-length
                const rootOutlet = this.createOutlet('primary', null, segmentGroup, null, null, this.currentUrlTree.queryParams);
                this.currentOutlet = rootOutlet;
            }

            this.currentOutlet.peekState().isRootSegmentGroup = true;
            return;
        }

        const queue = [];
        let currentTree = <any>urlTreeRoot;

        while (currentTree) {
            Object.keys(currentTree.children).forEach(outletName => {
                const currentSegmentGroup = currentTree.children[outletName];
                currentSegmentGroup.outlet = outletName;
                currentSegmentGroup.root = urlTreeRoot;

                const outletPath = this.getSegmentGroupFullPath(currentTree);
                let outletKey = this.getOutletKey(outletPath, outletName);
                let outlet = this.findOutlet(outletKey);

                const parentOutletName = currentTree.outlet || '';
                const parentOutletPath = this.getSegmentGroupFullPath(currentTree.parent);
                const parentOutletKey = this.getOutletKey(parentOutletPath, parentOutletName);
                const parentOutlet = this.findOutlet(parentOutletKey);

                const containsLastState = outlet && outlet.containsTopState(currentSegmentGroup.toString());
                if (!outlet) {
                    // tslint:disable-next-line:max-line-length
                    outlet = this.createOutlet(outletKey, outletPath, currentSegmentGroup, parentOutlet, this._modalNavigationDepth, this.currentUrlTree.queryParams);
                    this.currentOutlet = outlet;
                } else if (this._modalNavigationDepth > 0 && outlet.showingModal && !containsLastState) {
                    // Navigation inside modal view.
                    this.upsertModalOutlet(outlet, currentSegmentGroup, this.currentUrlTree.queryParams);
                } else {
                    outlet.parent = parentOutlet;

                    if (this.updateStates(outlet, currentSegmentGroup, this.currentUrlTree.queryParams)) {
                        this.currentOutlet = outlet; // If states updated
                    }
                }

                queue.push(currentSegmentGroup);
            });

            currentTree = queue.shift();
        }
    }

    replaceState(state: any, title: string, url: string, queryParams: string): void {
        const states = this.currentOutlet && this.currentOutlet.states;

        if (states && states.length > 0) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('NSLocationStrategy.replaceState changing existing state: ' +
                    `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            }
        } else {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('NSLocationStrategy.replaceState pushing new state: ' +
                    `${state}, title: ${title}, url: ${url}, queryParams: ${queryParams}`);
            }
            this.pushStateInternal(state, title, url, queryParams);
        }
    }

    forward(): void {
        throw new Error('NSLocationStrategy.forward() - not implemented');
    }

    back(outlet?: Outlet, frame?: Frame): void {
        this.currentOutlet = outlet || this.currentOutlet;

        if (this.currentOutlet.isPageNavigationBack) {
            const states = this.currentOutlet.states;
            // We are navigating to the previous page
            // clear the stack until we get to a page navigation state
            let state = states.pop();
            let count = 1;

            if (frame) {
                while (state.frame && state.frame !== frame) {
                    state = states.pop();
                    count++;
                }
            }

            while (!state.isPageNavigation) {
                state = states.pop();
                count++;
            }

            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog(`NSLocationStrategy.back() while navigating back. States popped: ${count}`);
            }
            this.callPopState(state, true);
        } else {
            let state = this.currentOutlet.peekState();
            if (state && state.isPageNavigation) {
                // This was a page navigation - so navigate through frame.
                if (NativeScriptDebug.isLogEnabled()) {
                    NativeScriptDebug.routerLog('NSLocationStrategy.back() while not navigating back but top' +
                        ' state is page - will call frame.goBack()');
                }

                if (!outlet) {
                    const topmostFrame = this.frameService.getFrame();
                    this.currentOutlet = this.getOutletByFrame(topmostFrame) || this.currentOutlet;
                }

                const frameToBack: Frame = this.currentOutlet.getFrameToBack();
                if (frameToBack) {
                    frameToBack.goBack();
                }
            } else {
                // Nested navigation - just pop the state
                if (NativeScriptDebug.isLogEnabled()) {
                    NativeScriptDebug.routerLog('NSLocationStrategy.back() while not navigating back but top' +
                        ' state is not page - just pop');
                }

                this.callPopState(this.currentOutlet.states.pop(), true);
            }
        }
    }

    canGoBack(outlet?: Outlet) {
        outlet = outlet || this.currentOutlet;
        return outlet.states.length > 1;
    }

    onPopState(fn: (_: any) => any): void {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.onPopState');
        }
        this.popStateCallbacks.push(fn);
    }

    getBaseHref(): string {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.getBaseHref()');
        }
        return '';
    }

    private callPopState(state: LocationState, pop: boolean = true, outlet?: Outlet) {
        outlet = outlet || this.currentOutlet;
        const urlSerializer = new DefaultUrlSerializer();
        let changedOutlet = this.getSegmentGroupByOutlet(outlet);

        if (state && changedOutlet) {
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, state.segmentGroup);
        } else if (changedOutlet) {
            // when closing modal view there are scenarios (e.g. root viewContainerRef) when we need
            // to clean up the named page router outlet to make sure we will open the modal properly again if needed.
            this.updateSegmentGroup(this.currentUrlTree.root, changedOutlet, null);
        }

        const url = urlSerializer.serialize(this.currentUrlTree);
        const change = { url: url, pop: pop };
        for (let fn of this.popStateCallbacks) {
            fn(change);
        }
    }

    public toString() {
        let result = [];

        this.outlets.forEach(outlet => {
            const outletStates = outlet.states;
            const outletLog = outletStates
                // tslint:disable-next-line:max-line-length
                .map((v, i) => `${outlet.outletKeys}.${i}.[${v.isPageNavigation ? 'PAGE' : 'INTERNAL'}].[${outlet.modalNavigationDepth ? 'MODAL' : 'BASE'}] "${v.segmentGroup.toString()}"`)
                .reverse();

            result = result.concat(outletLog);
        });

        return result.join('\n');
    }

    // Methods for syncing with page navigation in PageRouterOutlet
    public _beginBackPageNavigation(frame: Frame) {
        const outlet: Outlet = this.getOutletByFrame(frame);

        if (!outlet || outlet.isPageNavigationBack) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerError('Attempted to call startGoBack while going back.');
            }
            return;
        }

        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.startGoBack()');
        }
        outlet.isPageNavigationBack = true;

        this.currentOutlet = outlet;
    }

    public _finishBackPageNavigation(frame: Frame) {
        const outlet: Outlet = this.getOutletByFrame(frame);

        if (!outlet || !outlet.isPageNavigationBack) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerError('Attempted to call endGoBack while not going back.');
            }
            return;
        }

        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.finishBackPageNavigation()');
        }
        outlet.isPageNavigationBack = false;
    }

    public _beginModalNavigation(frame: Frame): void {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy._beginModalNavigation()');
        }

        this.currentOutlet = this.getOutletByFrame(frame) || this.currentOutlet;

        // It is possible to have frame, but not corresponding Outlet, if
        // showing modal dialog on app.component.ts ngOnInit() e.g. In that case
        // the modal is treated as none modal navigation.
        if (this.currentOutlet) {
            this.currentOutlet.showingModal = true;
            this._modalNavigationDepth++;
        }
    }

    public _closeModalNavigation() {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.closeModalNavigation()');
        }

        const isShowingModal = this._modalNavigationDepth > 0;

        if (isShowingModal) {
            this._modalNavigationDepth--;
        }

        // currentOutlet should be the one that corresponds to the topmost frame
        const topmostOutlet = this.getOutletByFrame(this.frameService.getFrame());
        const outlet = this.findOutletByModal(this._modalNavigationDepth, isShowingModal) || topmostOutlet;

        if (outlet) {
            this.currentOutlet = outlet;
            this.currentOutlet.showingModal = false;
            this.callPopState(this.currentOutlet.peekState(), false);
        }
    }

    public _beginPageNavigation(frame: Frame): NavigationOptions {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy._beginPageNavigation()');
        }

        this.currentOutlet = this.getOutletByFrame(frame);
        const lastState = this.currentOutlet.peekState();

        if (lastState) {
            lastState.isPageNavigation = true;
        }

        const navOptions = this._currentNavigationOptions || defaultNavOptions;
        if (navOptions.clearHistory) {
            if (NativeScriptDebug.isLogEnabled()) {
                NativeScriptDebug.routerLog('NSLocationStrategy._beginPageNavigation clearing states history');
            }
            this.currentOutlet.states = [lastState];
        }

        this._currentNavigationOptions = undefined;
        return navOptions;
    }

    public _setNavigationOptions(options: NavigationOptions) {
        this._currentNavigationOptions = {
            clearHistory: isPresent(options.clearHistory) ? options.clearHistory : false,
            animated: isPresent(options.animated) ? options.animated : true,
            transition: options.transition
        };

        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy._setNavigationOptions(' +
                `${JSON.stringify(this._currentNavigationOptions)})`);
        }
    }

    public _getOutlets(): Array<Outlet> {
        return this.outlets;
    }

    updateOutletFrame(outlet: Outlet, frame: Frame, isEmptyOutletFrame: boolean) {
        const lastState = outlet.peekState();

        if (lastState && !lastState.frame && !isEmptyOutletFrame) {
            lastState.frame = frame;
        }

        if (!outlet.containsFrame(frame)) {
            outlet.frames.push(frame);
        }
        this.currentOutlet = outlet;
    }

    clearOutlet(frame: Frame) {
        this.outlets = this.outlets.filter(currentOutlet => {
            let isEqualToCurrent;

            if (this.currentOutlet) {
                isEqualToCurrent = currentOutlet.pathByOutlets === this.currentOutlet.pathByOutlets;
            }

            // Remove outlet from the url tree.
            if (currentOutlet.containsFrame(frame) && !isEqualToCurrent) {
                this.callPopState(null, true, currentOutlet);
            }

            // Skip frames filtering since currentOutlet is <router-outlet> when no frames available.
            if (currentOutlet.frames.length && !currentOutlet.isNSEmptyOutlet) {
                currentOutlet.frames = currentOutlet.frames.filter(currentFrame => currentFrame !== frame);
                return currentOutlet.frames.length;
            }

            return !currentOutlet.containsFrame(frame);
        });
    }

    getSegmentGroupFullPath(segmentGroup: UrlSegmentGroup): string {
        let fullPath = '';

        while (segmentGroup) {
            const url = segmentGroup.toString();

            if (fullPath) {
                fullPath = (url ? url + '/' : '') + fullPath;
            } else {
                fullPath = url;
            }

            segmentGroup = segmentGroup.parent;
        }

        return fullPath;
    }

    getRouteFullPath(currentRoute: any): string {
        const outletName = currentRoute.outlet;
        let fullPath;

        currentRoute = currentRoute.parent;
        while (currentRoute) {
            const urls = (currentRoute.url.value || currentRoute.url);
            let url = urls;

            if (Array.isArray(urls)) {
                url = url.join('/');
            }

            fullPath = fullPath ? (url ? url + '/' : url) + fullPath : url;
            currentRoute = currentRoute.parent;
        }

        return fullPath ? fullPath + '-' + outletName : outletName;
    }


    getPathByOutlets(urlSegmentGroup: any): string {
        if (!urlSegmentGroup) {
            return '';
        }

        let pathToOutlet;
        let lastPath = urlSegmentGroup.outlet || 'primary';
        let parent = urlSegmentGroup.parent;

        while (parent && urlSegmentGroup.root !== parent) {
            if (parent && parent.outlet !== lastPath) {
                if (lastPath === 'primary') {
                    lastPath = parent.outlet;
                } else {
                    lastPath = parent.outlet;
                    pathToOutlet = lastPath + '-' + (pathToOutlet || urlSegmentGroup.outlet);
                }
            }

            parent = parent.parent;
        }

        return pathToOutlet || lastPath;
    }

    findOutlet(outletKey: string, activatedRouteSnapshot?: ActivatedRouteSnapshot): Outlet {
        let outlet: Outlet = this.outlets.find((currentOutlet) => {
            let equalModalDepth = currentOutlet.modalNavigationDepth === this._modalNavigationDepth;
            return equalModalDepth && currentOutlet.outletKeys.indexOf(outletKey) > -1;
        });

        // No Outlet with the given outletKey could happen when using nested unnamed p-r-o
        // primary -> primary -> prymary
        if (!outlet && activatedRouteSnapshot) {
            const pathByOutlets = this.getPathByOutlets(activatedRouteSnapshot);
            outlet = this.outlets.find((currentOutlet) => {
                let equalModalDepth = currentOutlet.modalNavigationDepth === this._modalNavigationDepth;
                return equalModalDepth && currentOutlet.pathByOutlets === pathByOutlets;
            });
        }

        return outlet;
    }

    private findOutletByModal(modalNavigation: number, isShowingModal?: boolean): Outlet {
        return this.outlets.find((outlet) => {
            let equalModalDepth = outlet.modalNavigationDepth === modalNavigation;
            return isShowingModal ? equalModalDepth && outlet.showingModal : equalModalDepth;
        });
    }

    private getOutletByFrame(frame: Frame): Outlet {
        let outlet;

        for (let index = 0; index < this.outlets.length; index++) {
            const currentOutlet = this.outlets[index];

            if (currentOutlet.containsFrame(frame)) {
                outlet = currentOutlet;
                break;
            }
        }

        return outlet;
    }

    private updateStates(outlet: Outlet, currentSegmentGroup: UrlSegmentGroup, queryParams: Params): boolean {
        const isNewPage = outlet.states.length === 0;
        const lastState = outlet.states[outlet.states.length - 1];
        const equalStateUrls = outlet.containsTopState(currentSegmentGroup.toString());

        const locationState: LocationState = {
            segmentGroup: currentSegmentGroup,
            isRootSegmentGroup: false,
            isPageNavigation: isNewPage,
            queryParams: {...queryParams}
        };

        if (!lastState || !equalStateUrls) {
            outlet.states.push(locationState);

            // Update last state segmentGroup of parent Outlet.
            if (this._modalNavigationDepth === 0 && !outlet.showingModal) {
                this.updateParentsStates(outlet, currentSegmentGroup.parent);
            }

            return true;
        }

        return false;
    }

    private updateParentsStates(outlet: Outlet, newSegmentGroup: UrlSegmentGroup) {
        let parentOutlet = outlet.parent;

        // Update parents lastState segmentGroups
        while (parentOutlet && newSegmentGroup) {
            const state = parentOutlet.peekState();

            if (state) {
                state.segmentGroup = newSegmentGroup;
                newSegmentGroup = newSegmentGroup.parent;
                parentOutlet = parentOutlet.parent;
            }
        }
    }

    // tslint:disable-next-line:max-line-length
    private createOutlet(outletKey: string, path: string, segmentGroup: any, parent: Outlet, modalNavigation?: number, queryParams: Params = {}): Outlet {
        const pathByOutlets = this.getPathByOutlets(segmentGroup);
        const newOutlet = new Outlet(outletKey, path, pathByOutlets, modalNavigation);

        const locationState: LocationState = {
            segmentGroup: segmentGroup,
            isRootSegmentGroup: false,
            isPageNavigation: true, // It is a new OutletNode.
            queryParams: {...queryParams}
        };

        newOutlet.states = [locationState];
        newOutlet.parent = parent;
        this.outlets.push(newOutlet);

        // Update last state segmentGroup of parent Outlet.
        if (this._modalNavigationDepth === 0 && !newOutlet.showingModal) {
            this.updateParentsStates(newOutlet, segmentGroup.parent);
        }

        return newOutlet;
    }

    private getSegmentGroupByOutlet(outlet: Outlet): UrlSegmentGroup {
        const pathList = outlet.pathByOutlets.split('-');
        let segmentGroup = this.currentUrlTree.root;
        let pathToOutlet;

        for (let index = 0; index < pathList.length; index++) {
            const currentPath = pathList[index];
            const childrenCount = Object.keys(segmentGroup.children).length;

            if (childrenCount && segmentGroup.children[currentPath]) {
                const url = segmentGroup.toString();
                pathToOutlet = pathToOutlet ? pathToOutlet + '/' + url : url;
                segmentGroup = segmentGroup.children[currentPath];
            } else {
                // If no child outlet found with the given name - forget about all previously found outlets.
                // example: seaching for 'primary-second-primary' shouldn't return 'primary-second'
                // if no 'primary' child available on 'second'.
                segmentGroup = null;
                break;
            }
        }

        // Paths should also match since there could be another Outlet
        // with the same pathByOutlets but different url path.
        if (segmentGroup && outlet.path && pathToOutlet && outlet.path !== pathToOutlet) {
            segmentGroup = null;
        }

        return segmentGroup;
    }

    // Traversal and replacement of segmentGroup.
    private updateSegmentGroup(rootNode: any, oldSegmentGroup: UrlSegmentGroup, newSegmentGroup: UrlSegmentGroup) {
        const queue = [];
        let currentTree = rootNode;

        while (currentTree) {
            Object.keys(currentTree.children).forEach(outletName => {
                if (currentTree.children[outletName] === oldSegmentGroup) {
                    if (newSegmentGroup) {
                        currentTree.children[outletName] = newSegmentGroup;
                    } else {
                        delete currentTree.children[outletName];
                    }
                }
                queue.push(currentTree.children[outletName]);
            });

            currentTree = queue.shift();
        }
    }

    private upsertModalOutlet(parentOutlet: Outlet, segmentedGroup: UrlSegmentGroup, queryParams: Params) {
        let currentModalOutlet = this.findOutletByModal(this._modalNavigationDepth);

        // We want to treat every p-r-o as a standalone Outlet.
        if (!currentModalOutlet) {
            if (this._modalNavigationDepth > 1) {
                // The parent of the current Outlet should be the previous opened modal (if any).
                parentOutlet = this.findOutletByModal(this._modalNavigationDepth - 1);
            }

            // No currentModalOutlet available when opening 'primary' p-r-o.
            const outletName = 'primary';
            const outletPath = parentOutlet.peekState().segmentGroup.toString();
            const outletKey = this.getOutletKey(outletPath, outletName);
            // tslint:disable-next-line:max-line-length
            currentModalOutlet = this.createOutlet(outletKey, outletPath, segmentedGroup, parentOutlet, this._modalNavigationDepth, queryParams);
            this.currentOutlet = currentModalOutlet;
        } else if (this.updateStates(currentModalOutlet, segmentedGroup, queryParams)) {
            this.currentOutlet = currentModalOutlet; // If states updated
        }
    }

    private getOutletKey(path: string, outletName: string): string {
        return path ? path + '-' + outletName : outletName;
    }

    ngOnDestroy() {
        if (NativeScriptDebug.isLogEnabled()) {
            NativeScriptDebug.routerLog('NSLocationStrategy.ngOnDestroy()');
        }

        this.outlets = [];
        this.currentOutlet = null;
    }
}
