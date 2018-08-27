import { Directive, HostListener, Input } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { routerLog, isLogEnabled } from "../trace";
import { RouterExtensions } from "./router-extensions";
import { NavigationOptions } from "./ns-location-strategy";
import { NavigationTransition } from "tns-core-modules/ui/frame";
import { isString } from "tns-core-modules/utils/types";

// Copied from "@angular/router/src/config"
export type QueryParamsHandling = "merge" | "preserve" | "";

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
export class NSRouterLink { // tslint:disable-line:directive-class-suffix
    @Input() target: string;
    @Input() queryParams: { [k: string]: any };
    @Input() fragment: string;

    @Input() queryParamsHandling: QueryParamsHandling;
    @Input() preserveQueryParams: boolean;
    @Input() preserveFragment: boolean;
    @Input() skipLocationChange: boolean;
    @Input() replaceUrl: boolean;

    @Input() clearHistory: boolean;
    @Input() pageTransition: boolean | string | NavigationTransition = true;
    @Input() pageTransitionDuration;

    private commands: any[] = [];

    constructor(
        private router: Router,
        private navigator: RouterExtensions,
        private route: ActivatedRoute) {
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
        if (isLogEnabled()) {
            routerLog(`nsRouterLink.tapped: ${this.commands} ` +
                `clear: ${this.clearHistory} ` +
                `transition: ${JSON.stringify(this.pageTransition)} ` +
                `duration: ${this.pageTransitionDuration}`);
        }

        const extras = this.getExtras();
        this.navigator.navigateByUrl(this.urlTree, extras);
    }

    private getExtras(): NavigationExtras & NavigationOptions {
        const transition = this.getTransition();
        return {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),

            clearHistory: this.convertClearHistory(this.clearHistory),
            animated: transition.animated,
            transition: transition.transition,
        };
    }

    get urlTree(): UrlTree {
        const urlTree = this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserveQueryParams),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
        });

        if (isLogEnabled()) {
            routerLog(`nsRouterLink urlTree created: ${urlTree}`);
        }

        return urlTree;
    }


    private convertClearHistory(value: boolean | string): boolean {
        return value === true || value === "true";
    }

    private getTransition(): { animated: boolean, transition?: NavigationTransition } {
        let transition: NavigationTransition = {};
        let animated: boolean;

        if (typeof this.pageTransition === "boolean") {
            animated = this.pageTransition;
        } else if (isString(this.pageTransition)) {
            if (this.pageTransition === "none" || this.pageTransition === "false") {
                animated = false;
            } else {
                animated = true;
                transition.name = <string>this.pageTransition;
            }
        } else {
            animated = true;
            transition = <NavigationTransition>this.pageTransition;
        }

        let duration = +this.pageTransitionDuration;
        if (!isNaN(duration)) {
            transition.duration = duration;
        }

        return { animated, transition };
    }
}

function attrBoolValue(s: any): boolean {
    return s === "" || !!s;
}
