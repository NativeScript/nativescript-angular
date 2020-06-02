import { Component, OnInit, OnDestroy } from "@angular/core";

import { Page } from "@nativescript/core/ui/page";

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
