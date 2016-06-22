import {Component} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router-deprecated/ns-router-deprecated";

@Component({
    selector: "second",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="Second component" class="title"></Label>
        <Button text="GO TO FIRST" [nsRouterLink]="['First']" class="link"></Button>
    </StackLayout>`
})
export class SecondComponent {}