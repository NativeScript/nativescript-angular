import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, RouteData, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {Component} from "@angular/core";
import {BaseComponent} from "./base.component";

@Component({
    selector: "second-comp",
    template: `
<StackLayout>
    <Label [automationText]="'second-' + id" [text]="'Second: ' + id"></Label>
    <Button [automationText]="'second-navigate-' + id" text="Go to first" (tap)="gotoFirst()"></Button>
</StackLayout>
    `
})
export class SecondComponent extends BaseComponent {
    constructor(private router: Router, private routeData: RouteData) {
        super();
    }

    ngOnInit() {
        this.id = this.routeData.get('id');
    }

    public id: string = ""

    gotoFirst() {
        this.router.navigateByUrl("/first");
    }
}
