import { Router, ActivatedRoute } from '@angular/router';
import { Component, Inject } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HOOKS_LOG, BaseComponent } from "./base.component";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
    selector: "first-comp",
    template: `
<StackLayout>
    <Label [automationText]="'first-' + id" [text]="'First: ' + id"></Label>
    <StackLayout orientation="horizontal">
        <Button [automationText]="'first-navigate-' + id" text="Go to second" (tap)="gotoSecond()"></Button>
        <Button [automationText]="'first-navigate-clear-history-' + id" text="With clear history"
                (tap)="gotoSecondAndClearHistory()">
        </Button>
    </StackLayout>
    <Label [automationText]="'hooks-log-' + id" [text]="hooksLog | async"></Label>
    <Label [text]="'hooks-log-' + id"></Label>
</StackLayout>
    `
})
export class FirstComponent extends BaseComponent {
    protected name = "first";
    public id: string = "";

    constructor(private routerExtensions: RouterExtensions,
                private routeData: ActivatedRoute,
                @Inject(HOOKS_LOG) hooksLog: BehaviorSubject<Array<string>>
    ) {
        super(hooksLog);
        this.id = routeData.snapshot.params["id"];
    }

    gotoSecond() {
        this.routerExtensions.navigateByUrl("/second/" + this.id);
    }

    gotoSecondAndClearHistory() {
        this.routerExtensions.navigateByUrl("/second/" + this.id, { clearHistory: true })
    }
}
