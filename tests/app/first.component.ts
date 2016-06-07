import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, RouteData, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {Component} from "@angular/core";
import {BaseComponent} from "./base.component";

@Component({
    selector: "first-comp",
    template: `
<StackLayout>
    <Label [automationText]="'first-' + id" [text]="'First: ' + id"></Label>
    <Button [automationText]="'first-navigate-' + id" text="Go to second" (tap)="gotoSecond()"></Button>
</StackLayout>
    `
})
export class FirstComponent extends BaseComponent {
    constructor(private router: Router, private routeData: RouteData) {
        super();
    }

    ngOnInit() {
        this.id = this.routeData.get('id');
    }

    public id: string = ""

    gotoSecond() {
        this.router.navigateByUrl("/second");
    }
}
