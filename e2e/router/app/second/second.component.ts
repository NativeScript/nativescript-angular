import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";

import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CounterService } from "../counter.service";

@Component({
    selector: "second",
    template: `
    <StackLayout>
        <Label text="SecondComponent" class="header"></Label>
        <Label [text]="'param: ' + (depth$ | async)" class="title"></Label>

        <Button text="GO TO FIRST" [nsRouterLink]="['/first']"></Button>
        <Button text="GO TO FIRST(CLEAR)" [nsRouterLink]="['/first']" clearHistory="true" pageTransition="flipRight"></Button>
        <Button text="GO TO NEXT SECOND" [nsRouterLink]="['/second', (nextDepth$ | async)]"></Button>
        <Button text="LOAD NESTED NAMED OUTLET" (tap)="loadNestedNamedOutlet()"></Button>
        <Button text="BACK" automationText="BACK" (tap)="goBack()"></Button>
        
        <Button text="TICK" automationText="TICK" (tap)="service.tick()"></Button>
        
        <GridLayout row="1" rows="*,*">
            <GridLayout row="0" class="nested-outlet">
                <router-outlet></router-outlet>
            </GridLayout>
            <GridLayout row="1">
                <page-router-outlet name="lazyNameOutlet"></page-router-outlet>
            </GridLayout>
        </GridLayout>
    </StackLayout>`
})
export class SecondComponent implements OnInit, OnDestroy {
    public depth$: Observable<string>;
    public nextDepth$: Observable<number>;

    constructor(
        private routerExt: RouterExtensions,
        private route: ActivatedRoute,
        public service: CounterService,
        page: Page) {
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
        this.routerExt.back({ relativeTo: this.route });
    }

    loadNestedNamedOutlet() {
        this.routerExt.navigate([{ outlets: { lazyNameOutlet: ["lazy-named"] } }], { relativeTo: this.route });
    }
}
