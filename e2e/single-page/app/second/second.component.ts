import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";

import { Page } from "ui/page";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "second",
    template: `
    <ActionBar title="Second Title">
        <ActionItem text="ACTION2"></ActionItem>
    </ActionBar>
    <StackLayout>
        <Label [text]="'Second component: ' + (id$ | async)" class="title"></Label>
    </StackLayout>`
})
export class SecondComponent implements OnInit, OnDestroy {
    public id$: Observable<number>;
    constructor(route: ActivatedRoute) {
        this.id$ = route.params.map(r => r["id"]);
    }

    ngOnInit() {
        console.log("SecondComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("SecondComponent - ngOnDestroy()");
    }
}