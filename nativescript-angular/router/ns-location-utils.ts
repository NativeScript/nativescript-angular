import { Frame, NavigationTransition } from '@nativescript/core/ui/frame';
import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree, ActivatedRouteSnapshot, Params } from '@angular/router';

export interface LocationState {
  queryParams: Params;
  segmentGroup: UrlSegmentGroup;
  isRootSegmentGroup: boolean;
  isPageNavigation: boolean;
  frame?: Frame;
}

export interface NavigationOptions {
  clearHistory?: boolean;
  animated?: boolean;
  transition?: NavigationTransition;
}

export class Outlet {
  showingModal: boolean;
  modalNavigationDepth: number;
  parent: Outlet;
  isPageNavigationBack: boolean;

  // More than one key available when using NSEmptyOutletComponent component
  // in module that lazy loads children (loadChildren) and has outlet name.
  outletKeys: Array<string>;

  // More than one frame available when using NSEmptyOutletComponent component
  // in module that lazy loads children (loadChildren) and has outlet name.
  frames: Array<Frame> = [];
  // The url path to the Outlet.
  // E.G: the path to Outlet3 that is nested Outlet1(home)->Outlet2(nested1)->Outlet3(nested2)
  // will be 'home/nested1'
  path: string;
  pathByOutlets: string;
  states: Array<LocationState> = [];
  isNSEmptyOutlet: boolean;

  // Used in reuse-strategy by its children to determine if they should be detached too.
  shouldDetach: boolean = true;
  constructor(outletKey: string, path: string, pathByOutlets: string, modalNavigationDepth?: number) {
      this.outletKeys = [outletKey];
      this.isPageNavigationBack = false;
      this.showingModal = false;
      this.modalNavigationDepth = modalNavigationDepth || 0;
      this.pathByOutlets = pathByOutlets;
      this.path = path;
  }

  containsFrame(frame: Frame): boolean {
      return this.frames.indexOf(frame) > -1;
  }

  peekState(): LocationState {
      if (this.states.length > 0) {
          return this.states[this.states.length - 1];
      }
      return null;
  }

  containsTopState(stateUrl: string): boolean {
      const lastState = this.peekState();
      return lastState && lastState.segmentGroup.toString() === stateUrl;
  }

  // Search for frame that can go back.
  // Nested 'primary' outlets could result in Outlet with multiple navigatable frames.
  getFrameToBack(): Frame {
      let frame = this.frames[this.frames.length - 1];

      if (!this.isNSEmptyOutlet) {
          for (let index = this.frames.length - 1; index >= 0; index--) {
              const currentFrame = this.frames[index];
              if (currentFrame.canGoBack()) {
                  frame = currentFrame;
                  break;
              }
          }
      }

      return frame;
  }
}

export const defaultNavOptions: NavigationOptions = {
  clearHistory: false,
  animated: true
};

