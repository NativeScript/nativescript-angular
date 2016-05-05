import {Component} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="Main Component" class="title"></Label>
        <Button text="Template" [nsRouterLink]="['Template']"></Button>
        <Button text="GO TO FIRST" [nsRouterLink]="['First']"></Button>      
        <Button text="GO TO SECOND" [nsRouterLink]="['Second']"></Button>
        <Button text="Router" [nsRouterLink]="['Router']"></Button>
    </StackLayout>`
})
export class MainComponent {}