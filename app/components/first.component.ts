import {Component} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";

@Component({
    selector: "first",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <Button text="GO TO SECOND" [nsRouterLink]="['Second']" class="link"></Button>
    </StackLayout>`
})
export class FirstComponent {}