import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, RouteData, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {Component, Inject} from "@angular/core";
import {HOOKS_LOG, BaseComponent} from "./base.component";

@Component({
    selector: "first-comp",
    template: `
<StackLayout>
    <Label [automationText]="'first-' + id" [text]="'First: ' + id"></Label>
    <Button [automationText]="'first-navigate-' + id" text="Go to second" (tap)="gotoSecond()"></Button>
    <TextView [automationText]="'hooks-log-' + id" [text]="hooksLog"></TextView>
    <TextView [text]="'hooks-log-' + id"></TextView>
</StackLayout>
    `
})
export class FirstComponent extends BaseComponent {
    name = "first";

    constructor(private router: Router, private routeData: RouteData, @Inject(HOOKS_LOG) hooksLog: string[]) {
        super(hooksLog);
    }

    ngOnInit() {
        this.id = this.routeData.get('id');
    }

    public id: string = ""

    gotoSecond() {
        this.router.navigateByUrl("/second");
    }
}
