import { Component, OnInit, OnDestroy } from "@angular/core";
import { Page } from "@nativescript/core/ui/page";
@Component({
    selector: "master",
    template: `
    <GridLayout rows="auto">   
        <StackLayout row="1" orientation="horizontal">
            <Button *ngFor="let detail of details" [text]="'DETAIL-NAMED ' + detail" [nsRouterLink]="['detail', detail]"></Button>
        </StackLayout>
    </GridLayout>
    `
})
export class NestedMasterComponent implements OnInit, OnDestroy {
    public details: Array<number> = [1, 2, 3];

    constructor(private page: Page) {
        this.page.actionBar.title = "NamedNestedMaster";
        console.log("MasterComponent - constructor()");
    }

    ngOnInit() {
        console.log("MasterComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("MasterComponent - ngOnDestroy()");
    }
}