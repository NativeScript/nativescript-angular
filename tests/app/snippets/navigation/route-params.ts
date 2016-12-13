// >> router-params-activated-route
import { ActivatedRoute } from '@angular/router';
class MyComponent {
  id: number;
  constructor(private route: ActivatedRoute) {
    this.route.params
      .forEach((params) => { this.id = +params['id']; });
  }
}
// << router-params-activated-route


// >> router-params-page-route
import { PageRoute } from "nativescript-angular/router";
class MyPageComponent {
  id: number;
  constructor(private pageRoute: PageRoute) {
    // use switchMap to get the latest activatedRoute instance
    this.pageRoute.activatedRoute
      .switchMap(activatedRoute => activatedRoute.params)
      .forEach((params) => { this.id = +params['id']; });
  }
}
// << router-params-page-route