import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
    selector: "master",
    template: `
    <StackLayout>
        <Label text="NestedMaster" class="nested-header"></Label>
            
        <Button *ngFor="let detail of details" [text]="'DETAIL ' + detail" [nsRouterLink]="['detail', detail]"></Button>
    </StackLayout>
    `
})
export class MasterComponent implements OnInit, OnDestroy {
    public details: Array<number> = [1, 2, 3];

    constructor() {
        console.log("MasterComponent - constructor()");
    }

    ngOnInit() {
        console.log("MasterComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("MasterComponent - ngOnDestroy()");
    }
}