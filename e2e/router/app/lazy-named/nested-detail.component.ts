import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "detail",
    template: `
    <GridLayout rows="auto, auto">
        <Label [text]="'nested-named-param: ' + (id$ | async)"></Label>
        <Button row="1" text="BACK-NESTED" (tap)="goBack()"></Button>
    </GridLayout>
    `
})
export class NestedDetailComponent {
    public id$: Observable<string>;

    constructor(private router: Router, private route: ActivatedRoute, private page: Page, private routerExt: RouterExtensions) {
        this.page.actionBar.title = "NamedNestedDetail";
        console.log("DetailComponent - constructor()");
        this.id$ = route.params.pipe(map(r => r["id"]));
    }

    ngOnInit() {
        console.log("DetailComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("DetailComponent - ngOnDestroy()");
    }

    goBack(){
        this.routerExt.back();
    }
}
