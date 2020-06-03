import { Component, OnInit, OnDestroy } from "@angular/core";
import { Page } from "@nativescript/core/ui/page";
@Component({
    selector: "master",
    template: `
    <GridLayout rows="auto, auto">
        <Label text="NestedMaster" class="nested-header"></Label>
                
        <StackLayout row="1" orientation="horizontal">
            <Button *ngFor="let detail of details" [text]="'DETAIL ' + detail" [nsRouterLink]="['detail', detail]"></Button>
        </StackLayout>
    </GridLayout>
    `
})
export class MasterComponent implements OnInit, OnDestroy {
    public details: Array<number> = [1, 2, 3];

    constructor(private page: Page) {
        this.page.actionBarHidden = true;
        console.log("MasterComponent - constructor()");
    }

    ngOnInit() {
        console.log("MasterComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("MasterComponent - ngOnDestroy()");
    }
}