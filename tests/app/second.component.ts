import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, RouteData, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {Component, Inject} from "@angular/core";
import {HOOKS_LOG, BaseComponent} from "./base.component";

@Component({
    selector: "second-comp",
    template: `
<StackLayout>
    <Label [automationText]="'second-' + id" [text]="'Second: ' + id"></Label>
    <Button [automationText]="'second-navigate-' + id" text="Go to first" (tap)="gotoFirst()"></Button>
    <TextView [automationText]="'hooks-log-' + id" [text]="hooksLog"></TextView>
    <TextView [text]="'hooks-log-' + id"></TextView>
</StackLayout>
    `
})
export class SecondComponent extends BaseComponent {
    constructor(private router: Router, private routeData: RouteData, @Inject(HOOKS_LOG) hooksLog: string[]) {
        super(hooksLog);
    }

    ngOnInit() {
        this.id = this.routeData.get('id');
    }

    public id: string = ""
    name = "second";

    gotoFirst() {
        this.router.navigateByUrl("/first");
    }
}
