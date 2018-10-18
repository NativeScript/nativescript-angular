import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";

import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "second",
    template: `
    <StackLayout>
        <Label text="SecondComponent" class="header"></Label>
        <Label [text]="'param: ' + (depth$ | async)" class="title"></Label>

        <Button text="GO TO FIRST" [nsRouterLink]="['/first']"></Button>
        <Button text="GO TO FIRST(CLEAR)" [nsRouterLink]="['/first']" clearHistory="true" pageTransition="flipRight"></Button>
        <Button text="GO TO NEXT SECOND" [nsRouterLink]="['/second', (nextDepth$ | async)]"></Button>
        <Button text="BACK" (tap)="goBack()"></Button>

        <StackLayout class="nested-outlet">
            <router-outlet></router-outlet>
        </StackLayout>
    </StackLayout>`
})
export class SecondComponent implements OnInit, OnDestroy {
    public depth$: Observable<string>;
    public nextDepth$: Observable<number>;

    constructor(private routerExt: RouterExtensions, route: ActivatedRoute, page: Page) {
        console.log("SecondComponent - constructor() page: " + page);
        this.depth$ = route.params.pipe(map(r => r["depth"]));
        this.nextDepth$ = route.params.pipe(map(r => +r["depth"] + 1));
    }

    ngOnInit() {
        console.log("SecondComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("SecondComponent - ngOnDestroy()");
    }

    goBack() {
        this.routerExt.back();
    }
}
