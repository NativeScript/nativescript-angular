import { Router, ActivatedRoute } from "@angular/router";
import { Component, Inject } from "@angular/core";
import { Location } from "@angular/common";
import { HOOKS_LOG, BaseComponent } from "./base.component";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
    selector: "second-comp",
    template: `
<StackLayout>
    <Label [automationText]="'second-' + id" [text]="'Second: ' + id"></Label>
    <Button [automationText]="'second-navigate-back-' + id" text="Go to first" (tap)="goBack()"></Button>
    <TextView [automationText]="'hooks-log-' + id" [text]="hooksLog | async"></TextView>
    <TextView [text]="'hooks-log-' + id"></TextView>
</StackLayout>
    `
})
export class SecondComponent extends BaseComponent {
    protected name = "second";
    public id: string = "";

    constructor(private router: Router, private location: Location, private routeData: ActivatedRoute, @Inject(HOOKS_LOG) hooksLog: BehaviorSubject<Array<string>>) {
        super(hooksLog);
        this.id = routeData.snapshot.params["id"];
    }

    goBack() {
        this.location.back();
    }
}
