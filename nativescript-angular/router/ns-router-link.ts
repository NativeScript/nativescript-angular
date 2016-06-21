import {Directive, HostBinding, HostListener, Input} from '@angular/core';

import {Router, ActivatedRoute} from '@angular/router';

/**
 * The RouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:

 * ```
 * [{ path: '/user', component: UserCmp }]
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [nsRouterLink]="['/user']">link to user component</a>
 * ```
 *
 * RouterLink expects the value to be an array of path segments, followed by the params
 * for that level of routing. For instance `['/team', {teamId: 1}, 'user', {userId: 2}]`
 * means that we want to generate a link to `/team;teamId=1/user;userId=2`.
 *
 * The first segment name can be prepended with `/`, `./`, or `../`.
 * If the segment begins with `/`, the router will look up the route from the root of the app.
 * If the segment begins with `./`, or doesn't begin with a slash, the router will
 * instead look in the current component's children for the route.
 * And if the segment begins with `../`, the router will go up one level.
 */
@Directive({selector: '[nsRouterLink]'})
export class NSRouterLink {
  @Input() queryParams: {[k: string]: any};
  @Input() fragment: string;

  private commands: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  @Input("nsRouterLink")
  set params(data: any[]|string) {
    if (Array.isArray(data)) {
      this.commands = <any>data;
    } else {
      this.commands = [data];
    }
  }

  @HostListener("tap")
  onTap() {
    this.router.navigate(
        this.commands,
        {relativeTo: this.route, queryParams: this.queryParams, fragment: this.fragment});
  }
}
