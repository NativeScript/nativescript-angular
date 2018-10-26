import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";

import { Page } from "tns-core-modules/ui/page";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "second",
    template: `
    <ActionBar title="Second Title">
        <ActionItem text="ACTION2"></ActionItem>
    </ActionBar>

    <ActionBarExtension *ngIf="(id$ | async) === 2">
        <ActionItem text="ADD" ios.position="right"></ActionItem>
    </ActionBarExtension>

    <StackLayout>
        <Label [text]="'Second Component: ' + (id$ | async)" class="title"></Label>
        <Button text="Back" (tap)="back()"></Button>
    </StackLayout>`
})
export class SecondComponent implements OnInit, OnDestroy {
    public id$: Observable<number>;
    constructor(route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.id$ = route.params.pipe(map(r => +r["id"]));
    }

    ngOnInit() {
        console.log("SecondComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("SecondComponent - ngOnDestroy()");
    }

    back() {
        this.routerExtensions.back();
    }
}