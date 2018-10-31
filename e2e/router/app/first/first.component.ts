import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { Page } from "tns-core-modules/ui/page";

@Component({
    selector: "first",
    template: `
    <StackLayout>
        <Label text="FirstComponent" class="header"></Label>

        <Button text="GO TO SECOND" automationText="GO TO SECOND" [nsRouterLink]="['/second','1']"></Button>
        <Button text="GO TO C-LESS SECOND" automationText="GO TO C-LESS SECOND" [nsRouterLink]="['/c-less', 'deep', '100', 'detail', '200']"></Button>
        
        <Button text="GO TO LAZY HOME" automationText="GO TO LAZY HOME" [nsRouterLink]="['/lazy','home']"></Button>
        <Button text="GO TO C-LESS LAZY" automationText="GO TO C-LESS LAZY" [nsRouterLink]="['/lazy','nest','more']"></Button>
        
        <Button text="BACK" automationText="BACK" (tap)="goBack()"></Button>
        <Label [text]="message"></Label>
    </StackLayout>`
})
export class FirstComponent implements OnInit, OnDestroy {
    public message: string = "";
    constructor(private routerExt: RouterExtensions, page: Page) {
        console.log("FirstComponent - constructor() page: " + page);
    }

    ngOnInit() {
        console.log("FirstComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("FirstComponent - ngOnDestroy()");
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
