import {AfterContentInit, ContentChildren, Directive, ElementRef, Input, OnChanges, OnDestroy, QueryList, Renderer} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {NavigationEnd, Router} from '@angular/router';
import {UrlTree, containsTree} from '@angular/router/src/url_tree';

import {NSRouterLink} from './ns-router-link';


/**
 * The NSRouterLinkActive directive lets you add a CSS class to an element when the link's route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link">Bob</a>
 * ```
 *
 * When the url is either '/user' or '/user/bob', the active-link class will
 * be added to the component. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="class1 class2">Bob</a>
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="['class1', 'class2']">Bob</a>
 * ```
 *
 * You can configure NSRouterLinkActive by passing `exact: true`. This will add the classes
 * only when the url matches the link exactly.
 *
 * ```
 * <a [nsRouterLink]="/user/bob" [nsRouterLinkActive]="active-link" [nsRouterLinkActiveOptions]="{exact:
 * true}">Bob</a>
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
 * This will set the active-link class on the div tag if the url is either '/user/jim' or
 * '/user/bob'.
 *
 * @stable
 */
@Directive({ selector: '[nsRouterLinkActive]' })
export class NSRouterLinkActive implements OnChanges, OnDestroy, AfterContentInit {
    @ContentChildren(NSRouterLink) links: QueryList<NSRouterLink>;

    private classes: string[] = [];
    private subscription: Subscription;

    @Input() private nsRouterLinkActiveOptions: { exact: boolean } = { exact: false };

    constructor(private router: Router, private element: ElementRef, private renderer: Renderer) {
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    ngAfterContentInit(): void {
        this.links.changes.subscribe(s => this.update());
        this.update();
    }

    @Input("nsRouterLinkActive")
    set nsRouterLinkActive(data: string[] | string) {
        if (Array.isArray(data)) {
            this.classes = <any>data;
        } else {
            this.classes = data.split(' ');
        }
    }

    ngOnChanges(changes: {}): any { this.update(); }
    ngOnDestroy(): any { this.subscription.unsubscribe(); }

    private update(): void {
        if (!this.links) return;

        const currentUrlTree = this.router.parseUrl(this.router.url);
        const isActiveLinks = this.reduceList(currentUrlTree, this.links);
        this.classes.forEach(
            c => this.renderer.setElementClass(
                this.element.nativeElement, c, isActiveLinks));
    }

    private reduceList(currentUrlTree: UrlTree, q: QueryList<any>): boolean {
        return q.reduce(
            (res: boolean, link: NSRouterLink) =>
                res || containsTree(currentUrlTree, link.urlTree, this.nsRouterLinkActiveOptions.exact),
            false);
    }
}
