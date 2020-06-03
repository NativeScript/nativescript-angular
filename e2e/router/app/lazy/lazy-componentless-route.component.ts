import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";
import { Location } from "@angular/common";
import { RouterExtensions } from "@nativescript/angular/router";

import { Page } from "@nativescript/core/ui/page";

@Component({
    selector: "lazy",
    template: `
    <StackLayout>
        <Label text="Lazy Componentless Route" class="header"></Label>

        <Button text="GO TO LAZY HOME" [nsRouterLink]="['/lazy','home']"></Button>

        <Button text="GO TO FIRST" [nsRouterLink]="['/first']"></Button>
        <Button text="BACK" (tap)="goBack()"></Button>
        <Label [text]="message"></Label>
    </StackLayout>`
})
export class LazyComponentlessRouteComponent implements OnInit, OnDestroy {
    public message: string = "";
    constructor(private routerExt: RouterExtensions, page: Page) {
        console.log("LazyNestedRouteComponent - constructor() page: " + page);
    }

    ngOnInit() {
        console.log("LazyNestedRouteComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("LazyNestedRouteComponent - ngOnDestroy()");
    }

    goBack() {
        this.message = "";
        if (this.routerExt.canGoBack()) {
            this.routerExt.back();
        } else {
            this.message = "canGoBack() - false"
        }
    }
}
