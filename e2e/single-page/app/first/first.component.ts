import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";
import { Location } from "@angular/common";

import { Page } from "ui/page";
import { Observable } from "rxjs/Observable";
import { FrameService } from "nativescript-angular/platform-providers";

@Component({
    selector: "first",
    template: `
    <ActionBar title="First Title">
        <ActionItem text="ACTION1"></ActionItem>
    </ActionBar>
    <StackLayout>
        <Label text="First Component" class="title"></Label>
    </StackLayout>`
})
export class FirstComponent implements OnInit, OnDestroy {
    constructor(page: Page) {
        console.log("FirstComponent - constructor() page: " + page);
    }

    ngOnInit() {
        console.log("FirstComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("FirstComponent - ngOnDestroy()");
    }
}
