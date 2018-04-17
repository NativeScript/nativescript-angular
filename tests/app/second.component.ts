import { Router, ActivatedRoute } from "@angular/router";
import { Component, Inject, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { HOOKS_LOG, BaseComponent } from "./base.component";
import { BehaviorSubject } from "rxjs";

@Component({
    selector: "second-comp",
    template: `
<StackLayout>
    <Label [automationText]="'second-' + id" [text]="'Second: ' + id"></Label>
    <Button [automationText]="'second-navigate-back-' + id" text="Go to first" (tap)="goBack()"></Button>
    <Label [automationText]="'hooks-log-' + id" [text]="hooksLog | async"></Label>
    <Label [text]="'hooks-log-' + id"></Label>
    <Label [automationText]="'router-location-strategy-states-' + id" [text]="routerLocationStrategystates"></Label>
</StackLayout>
    `
})
export class SecondComponent extends BaseComponent implements OnInit {
    protected name = "second";
    public id: string = "";
    protected routerLocationStrategystates = "";

    constructor(private routerExtensions: RouterExtensions,
                private location: Location,
                private routeData: ActivatedRoute,
                @Inject(HOOKS_LOG) hooksLog: BehaviorSubject<Array<string>>
    ) {
        super(hooksLog);
        this.id = routeData.snapshot.params["id"];
    }

    ngOnInit() {
        super.ngOnInit();
        this.routerLocationStrategystates = this.routerExtensions.locationStrategy
            ._getStates()
            .map(state => state.url).join(",");
    }

    goBack() {
        this.location.back();
    }
}
