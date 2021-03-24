import { AfterContentInit, ChangeDetectorRef, ContentChildren, Directive, ElementRef, Input, OnChanges, OnDestroy, Optional, QueryList, Renderer2 } from '@angular/core';
import { from, of, Subscription } from 'rxjs';

import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { containsTree } from './private-imports/router-url-tree';

import { NSRouterLink } from './ns-router-link';
import { mergeAll } from 'rxjs/operators';

/**
 * The NSRouterLinkActive directive lets you add a CSS class to an element when the link"s route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link">Bob</a>
 * ```
 *
 * When the url is either "/user" or "/user/bob", the active-link class will
 * be added to the component. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="class1 class2">Bob</a>
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="["class1", "class2"]">Bob</a>
 * ```
 *
 * You can configure NSRouterLinkActive by passing `exact: true`. This will add the
 * classes only when the url matches the link exactly.
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link"
 * [nsRouterLinkActiveOptions]="{exact: true}">Bob</a>
 * ```
 *
 * Finally, you can apply the NSRouterLinkActive directive to an ancestor of a RouterLink.
 *
 * ```
 * <div [nsRouterLinkActive]="active-link" [nsRouterLinkActiveOptions]="{exact: true}">
 *   <a [nsRouterLink]="/user/jim">Jim</a>
 *   <a [nsRouterLink]="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * This will set the active-link class on the div tag if the url is either "/user/jim" or
 * "/user/bob".
 *
 * @stable
 */
@Directive({
	selector: '[nsRouterLinkActive]',
	exportAs: 'routerLinkActive',
})
export class NSRouterLinkActive implements OnChanges, OnDestroy, AfterContentInit {
	// tslint:disable-line:max-line-length directive-class-suffix
	@ContentChildren(NSRouterLink, { descendants: true }) links: QueryList<NSRouterLink>;

	private classes: string[] = [];
	private routerEventsSubscription: Subscription;
	private linkInputChangesSubscription?: Subscription;
	private active: boolean = false;

	@Input() nsRouterLinkActiveOptions: { exact: boolean } = { exact: false };

	constructor(private router: Router, private element: ElementRef, private renderer: Renderer2, private readonly cdr: ChangeDetectorRef, @Optional() private link?: NSRouterLink) {
		this.routerEventsSubscription = router.events.subscribe((s) => {
			if (s instanceof NavigationEnd) {
				this.update();
			}
		});
	}

	get isActive(): boolean {
		return this.active;
	}

	ngAfterContentInit(): void {
		// `of(null)` is used to force subscribe body to execute once immediately (like `startWith`).
		from([this.links.changes, of(null)])
			.pipe(mergeAll())
			.subscribe((_) => {
				this.update();
				this.subscribeToEachLinkOnChanges();
			});
	}

	private subscribeToEachLinkOnChanges() {
		this.linkInputChangesSubscription?.unsubscribe();
		const allLinkChanges = [...this.links.toArray(), this.link].filter((link): link is NSRouterLink => !!link).map((link) => link.onChanges);
		this.linkInputChangesSubscription = from(allLinkChanges)
			.pipe(mergeAll())
			.subscribe((link) => {
				if (this.isActive !== this.isLinkActive(this.router)(link)) {
					this.update();
				}
			});
	}

	@Input('nsRouterLinkActive')
	set nsRouterLinkActive(data: string[] | string) {
		if (Array.isArray(data)) {
			this.classes = <any>data;
		} else {
			this.classes = data.split(' ');
		}
	}

	ngOnChanges(_: {}): any {
		this.update();
	}
	ngOnDestroy(): any {
		this.routerEventsSubscription.unsubscribe();
		this.linkInputChangesSubscription?.unsubscribe();
	}

	private update(): void {
		if (!this.links) {
			return;
		}
		Promise.resolve().then(() => {
			const hasActiveLinks = this.hasActiveLinks();
			if (this.active !== hasActiveLinks) {
				this.active = hasActiveLinks;
				const currentUrlTree = this.router.parseUrl(this.router.url);
				const links = this.link ? [...this.links.toArray(), this.link] : this.links;
				const isActiveLinks = this.reduceList(currentUrlTree, links);
				this.cdr.markForCheck();
				this.classes.forEach((c) => {
					if (isActiveLinks) {
						this.renderer.addClass(this.element.nativeElement, c);
					} else {
						this.renderer.removeClass(this.element.nativeElement, c);
					}
				});
			}
		});
	}

	private reduceList(currentUrlTree: UrlTree, q: QueryList<any> | Array<any>): boolean {
		return q.reduce((res: boolean, link: NSRouterLink) => {
			return res || containsTree(currentUrlTree, link.urlTree, this.nsRouterLinkActiveOptions.exact);
		}, false);
	}

	private isLinkActive(router: Router): (link: NSRouterLink) => boolean {
		return (link: NSRouterLink) => router.isActive(link.urlTree, this.nsRouterLinkActiveOptions.exact);
	}

	private hasActiveLinks(): boolean {
		const isActiveCheckFn = this.isLinkActive(this.router);
		return (this.link && isActiveCheckFn(this.link)) || this.links.some(isActiveCheckFn);
	}
}
