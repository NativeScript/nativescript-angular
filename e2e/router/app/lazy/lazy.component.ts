import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { Page } from "ui/page";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "lazy",
    template: `
    <StackLayout>
        <Label text="LazyComponent" class="header"></Label>

        <Button text="GO TO C-LESS LAZY" [nsRouterLink]="['/lazy','nest','more']"></Button>

        <Button text="GO TO FIRST" [nsRouterLink]="['/first']"></Button>
        <Button text="BACK" (tap)="goBack()"></Button>
        <Label [text]="message"></Label>
    </StackLayout>`
})
export class LazyComponent implements OnInit, OnDestroy {
    public message: string = "";
    constructor(private routerExt: RouterExtensions, page: Page) {
        console.log("LazyComponent - constructor() page: " + page);
    }

    ngOnInit() {
        console.log("LazyComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("LazyComponent - ngOnDestroy()");
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
