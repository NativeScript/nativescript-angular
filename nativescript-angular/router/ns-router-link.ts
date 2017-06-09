import { Directive, HostListener, Input, Optional, OnChanges } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { routerLog } from "../trace";
import { PageRoute } from "./page-router-outlet";
import { RouterExtensions } from "./router-extensions";
import { NavigationOptions } from "./ns-location-strategy";
import { NavigationTransition } from "tns-core-modules/ui/frame";
import { isString } from "tns-core-modules/utils/types";

/**
 * The nsRouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:
 * ```
 * [{ path: "/user", component: UserCmp }]
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [nsRouterLink]="["/user"]">link to user component</a>
 * ```
 *
 * NSRouterLink expects the value to be an array of path segments, followed by the params
 * for that level of routing. For instance `["/team", {teamId: 1}, "user", {userId: 2}]`
 * means that we want to generate a link to `/team;teamId=1/user;userId=2`.
 *
 * The first segment name can be prepended with `/`, `./`, or `../`.
 * If the segment begins with `/`, the router will look up the route from the root of the app.
 * If the segment begins with `./`, or doesn"t begin with a slash, the router will
 * instead look in the current component"s children for the route.
 * And if the segment begins with `../`, the router will go up one level.
 */
@Directive({ selector: "[nsRouterLink]" })
export class NSRouterLink implements OnChanges { // tslint:disable-line:directive-class-suffix
    private commands: any[] = [];
    @Input() target: string;
    @Input() queryParams: { [k: string]: any };
    @Input() fragment: string;

    @Input() clearHistory: boolean;
    @Input() pageTransition: boolean | string | NavigationTransition = true;

    urlTree: UrlTree;

    private usePageRoute: boolean;

    private get currentRoute(): ActivatedRoute {
        return this.usePageRoute ? this.pageRoute.activatedRoute.getValue() : this.route;
    }

    constructor(
        private router: Router,
        private navigator: RouterExtensions,
        private route: ActivatedRoute,
        @Optional() private pageRoute: PageRoute) {

        this.usePageRoute = (this.pageRoute && this.route === this.pageRoute.activatedRoute.getValue());
    }

    @Input("nsRouterLink")
    set params(data: any[] | string) {
        if (Array.isArray(data)) {
            this.commands = data;
        } else {
            this.commands = [data];
        }
    }


    @HostListener("tap")
    onTap() {
        routerLog("nsRouterLink.tapped: " + this.commands + " usePageRoute: " +
            this.usePageRoute + " clearHistory: " + this.clearHistory + " transition: " +
            JSON.stringify(this.pageTransition));

        const extras = this.getExtras();
        this.navigator.navigateByUrl(this.urlTree, extras);
    }

    private getExtras(): NavigationExtras & NavigationOptions {
        const transition = this.getTransition();
        return {
            queryParams: this.queryParams,
            fragment: this.fragment,
            clearHistory: this.convertClearHistory(this.clearHistory),
            animated: transition.animated,
            transition: transition.transition,
            relativeTo: this.currentRoute,
        };
    }

    private convertClearHistory(value: boolean | string): boolean {
        return value === true || value === "true";
    }

    private getTransition(): { animated: boolean, transition?: NavigationTransition } {
        if (typeof this.pageTransition === "boolean") {
            return { animated: <boolean>this.pageTransition };
        } else if (isString(this.pageTransition)) {
            if (this.pageTransition === "none" || this.pageTransition === "false") {
                return { animated: false };
            } else {
                return { animated: true, transition: { name: <string>this.pageTransition } };
            }
        } else {
            return {
                animated: true,
                transition: this.pageTransition
            };
        }
    }

    ngOnChanges(_: {}): any {
        this.updateUrlTree();
    }

    private updateUrlTree(): void {
        this.urlTree = this.router.createUrlTree(
            this.commands,
            { relativeTo: this.currentRoute, queryParams: this.queryParams, fragment: this.fragment });
    }
}
