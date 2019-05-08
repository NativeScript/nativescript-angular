import { Component, OnInit, OnDestroy, OnChanges, DoCheck } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

import { CounterService } from "../counter.service";

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
        <Button text="RESET" automationText="RESET" (tap)="reset()"></Button>
        <Label [text]="message"></Label>
        <Label [text]="'CHECK: ' + doCheckCount"></Label>
        <Label [text]="'COUNTER: ' + (service.counter$ | async)"></Label>
    </StackLayout>`
})
export class FirstComponent implements OnInit, OnDestroy, DoCheck {
    public message: string = "";
    public doCheckCount: number = 0;

    constructor(
        private routerExt: RouterExtensions,
        public service: CounterService,
        page: Page) {

        console.log("FirstComponent - constructor() page: " + page);
    }

    ngOnInit() {
        console.log("FirstComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("FirstComponent - ngOnDestroy()");
    }

    ngDoCheck() {
        this.doCheckCount++;
        console.log("FirstComponent - ngDoCheck(): " + this.doCheckCount);
    }

    reset() {
        this.doCheckCount = 0;
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
