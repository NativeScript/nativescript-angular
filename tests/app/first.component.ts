import { Router, ActivatedRoute } from '@angular/router';
import { Component, Inject } from "@angular/core";
import { HOOKS_LOG, BaseComponent } from "./base.component";
import { BehaviorSubject } from "rxjs";

@Component({
    selector: "first-comp",
    template: `
<StackLayout>
    <Label [automationText]="'first-' + id" [text]="'First: ' + id"></Label>
    <Button [automationText]="'first-navigate-' + id" text="Go to second" (tap)="gotoSecond()"></Button>
    <TextView [automationText]="'hooks-log-' + id" [text]="hooksLog | async"></TextView>
    <TextView [text]="'hooks-log-' + id"></TextView>
</StackLayout>
    `
})
export class FirstComponent extends BaseComponent {
    protected name = "first";
    public id: string = "";

    constructor(private router: Router, private routeData: ActivatedRoute, @Inject(HOOKS_LOG) hooksLog: BehaviorSubject<Array<string>>) {
        super(hooksLog);
        this.id = routeData.snapshot.params["id"];
    }

    gotoSecond() {
        this.router.navigateByUrl("/second/" + this.id);
    }
}
