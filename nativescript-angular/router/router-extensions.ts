import { Injectable } from '@angular/core';
import { Router, UrlTree, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NSLocationStrategy } from './ns-location-strategy';
import { NavigationOptions, Outlet } from './ns-location-utils';
import { FrameService } from '../frame.service';
import { NativeScriptDebug } from '../trace';
import { findTopActivatedRouteNodeForOutlet } from './page-router-outlet-utils';

export type ExtendedNavigationExtras = NavigationExtras & NavigationOptions;

export interface BackNavigationOptions {
	outlets?: Array<string>;
	relativeTo?: ActivatedRoute | null;
}

@Injectable({
	providedIn: 'root',
})
export class RouterExtensions {
	constructor(public router: Router, public locationStrategy: NSLocationStrategy, public frameService: FrameService) {}

	public navigate(commands: any[], extras?: ExtendedNavigationExtras): Promise<boolean> {
		if (extras) {
			this.locationStrategy._setNavigationOptions(extras);
		}
		return this.router.navigate(commands, extras);
	}

	public navigateByUrl(url: string | UrlTree, options?: NavigationOptions): Promise<boolean> {
		if (options) {
			this.locationStrategy._setNavigationOptions(options);
		}
		return this.router.navigateByUrl(url);
	}

	public back(backNavigationOptions?: BackNavigationOptions) {
		if (backNavigationOptions) {
			this.backOutlets(backNavigationOptions);
		} else {
			this.locationStrategy.back();
		}
	}

	public canGoBack(backNavigationOptions?: BackNavigationOptions) {
		let canGoBack = true;
		if (backNavigationOptions) {
			const { outletsToBack, outlets } = this.findOutletsToBack(backNavigationOptions);

			if (outletsToBack.length !== outlets.length) {
				NativeScriptDebug.routerError('No outlet found relative to activated route');
			} else {
				outletsToBack.forEach((outletToBack) => {
					if (!this.locationStrategy.canGoBack(outletToBack)) {
						canGoBack = false;
					}
				});
			}
		} else {
			canGoBack = this.locationStrategy.canGoBack();
		}

		return canGoBack;
	}

	public backToPreviousPage() {
		this.frameService.getFrame().goBack();
	}

	public canGoBackToPreviousPage(): boolean {
		return this.frameService.getFrame().canGoBack();
	}

	private backOutlets(options: BackNavigationOptions) {
		const { outletsToBack, outlets } = this.findOutletsToBack(options);

		if (outletsToBack.length !== outlets.length) {
			NativeScriptDebug.routerError('No outlet found relative to activated route');
		} else {
			outletsToBack.forEach((outletToBack) => {
				if (outletToBack.isPageNavigationBack) {
					NativeScriptDebug.routerError('Attempted to call startGoBack while going back:');
				} else {
					this.locationStrategy.back(outletToBack);
				}
			});
		}
	}

	// tslint:disable-next-line:max-line-length
	private findOutletsToBack(options?: BackNavigationOptions): { outletsToBack: Array<Outlet>; outlets: Array<string> } {
		const outletsToBack: Array<Outlet> = [];
		const rootRoute: ActivatedRoute = this.router.routerState.root;
		let outlets = options.outlets;
		let relativeRoute = options.relativeTo || rootRoute;

		const relativeRouteOutlet = this.findOutletByRoute(relativeRoute);
		const isNSEmptyOutlet = relativeRouteOutlet && relativeRouteOutlet.isNSEmptyOutlet;

		// Lazy named outlet has added 'primary' inner NSEmptyOutlet child.
		// Take parent route when `relativeTo` option points to the outer named outlet.
		if (isNSEmptyOutlet && relativeRoute.outlet !== 'primary') {
			relativeRoute = relativeRoute.parent || relativeRoute;
		}

		const routesToMatch = outlets ? relativeRoute.children : [relativeRoute];
		outlets = outlets || [relativeRoute.outlet];

		for (let index = 0; index < routesToMatch.length; index++) {
			const currentRoute = routesToMatch[index];
			if (outlets.some((currentOutlet) => currentOutlet === currentRoute.outlet)) {
				const outlet = this.findOutletByRoute(currentRoute);

				if (outlet) {
					outletsToBack.push(outlet);
				}
			}
		}

		return { outletsToBack: outletsToBack, outlets: outlets };
	}

	private findOutletByRoute(currentRoute: ActivatedRoute): Outlet {
		let outlet;

		const currentRouteSnapshop = findTopActivatedRouteNodeForOutlet(currentRoute.snapshot);
		const outletKey = this.locationStrategy.getRouteFullPath(currentRouteSnapshop);
		outlet = this.locationStrategy.findOutlet(outletKey, currentRouteSnapshop);

		return outlet;
	}
}
