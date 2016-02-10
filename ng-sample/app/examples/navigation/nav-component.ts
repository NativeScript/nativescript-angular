import {Component} from 'angular2/core';
import {OnActivate, OnDeactivate, LocationStrategy, RouteParams, ComponentInstruction } from 'angular2/router';
import {topmost} from "ui/frame";
import {NS_ROUTER_DIRECTIVES} from "../../nativescript-angular/router/ns-router";


@Component({
    selector: 'example-group',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
<GridLayout rows="auto, auto, auto" columns="*, *" margin="10">
    <Label [text]="'Componenet ID: ' + compId" colSpan="2" row="0"
        style="font-size: 30; horizontal-align: center; margin: 10"></Label>
        
    <Label [text]="'Depth: ' + depth" colSpan="2" row="1"
        style="font-size: 30; horizontal-align: center; margin: 10"></Label>
        
    <Button text="BACK" row="2" col="0" width="150"
        (tap)="goBack()"></Button>
        
    <Button text="FORWARD" row="2" col="1" width="150"
        [nsRouterLink]="['/Nav', { depth: depth + 1 }]"></Button>
</GridLayout>
`
})
export class NavComponent implements OnActivate, OnDeactivate {
    static counter: number = 0;

    public compId: number;
    public depth: number;

    constructor(params: RouteParams, private location: LocationStrategy) {
        NavComponent.counter++;

        this.compId = NavComponent.counter;
        this.depth = parseInt(params.get("depth"));
        
        console.log("NavComponent.constructor() componenetID: " + this.compId)
    }

    public goBack() {
        // this.location.back();
        topmost().goBack();
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnActivate() componenetID: " + this.compId)
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnDeactivate() componenetID: " + this.compId)
    }
}