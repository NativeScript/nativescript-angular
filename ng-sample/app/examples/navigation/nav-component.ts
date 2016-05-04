import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
 RouteParams, ComponentInstruction, RouteConfig } from '@angular/router';
import {Location, LocationStrategy} from '@angular/common';
import {topmost} from "ui/frame";
import {Page} from "ui/page";
import {NS_ROUTER_DIRECTIVES} from "../../nativescript-angular/router/ns-router";


@Component({
    selector: 'master',
    template: `
    <StackLayout>
        <Label text="Master View" style="font-size: 20; horizontal-align: center; margin: 10"></Label>
            
        <Button *ngFor="#detail of details" [text]="'Detail ' + detail" (tap)="onSelect(detail)"></Button>
    </StackLayout>
    `
})
class MasterComponent {
    public details: Array<number> = [1, 2, 3];

    constructor(private _router: Router) {
        console.log("MasterComponent.constructor()");
    }

    onSelect(val: number) {
        this._router.navigate(['../Detail', { id: val }]);
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("MasterComponent.routerOnActivate()")
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("MasterComponent.routerOnDeactivate()")
    }
}

@Component({
    selector: 'detail',
    template: `
    <StackLayout margin="10">
        <Button text="BACK TO MASTER" (tap)="onUnselect()"></Button>
            
        <Label [text]="'Detail: ' + id"
            style="font-size: 20; horizontal-align: center; margin: 10"></Label>
    </StackLayout>
    `
})
class DetailComponent {
    public id: number;
    constructor(params: RouteParams, private _router: Router) {
        console.log("DetailComponent.constructor()");
        this.id = parseInt(params.get("id"));
    }

    onUnselect() {
        this._router.navigate(['../Main']);
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("DetailComponent.routerOnActivate() id: " + this.id)
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("DetailComponent.routerOnDeactivate() id: " + this.id)
    }
}


@Component({
    selector: 'example-group',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
<GridLayout rows="auto, auto, auto, *" columns="*, *" margin="10" backgroundColor="lightgreen">
    <Label [text]="'Component ID: ' + compId" colSpan="2" row="0"
        style="font-size: 30; horizontal-align: center"></Label>
        
    <Label [text]="'Depth: ' + depth" colSpan="2" row="1"
        style="font-size: 30; horizontal-align: center"></Label>
        
    <Button text="BACK" row="2" col="0" width="150"
        (tap)="goBack()"></Button>
        
    <Button text="FORWARD" row="2" col="1" width="150"
        [nsRouterLink]="['/Nav', { depth: depth + 1 }]"></Button>
        
    <GridLayout backgroundColor="pink" margin="10" row="3" colSpan="2">
        <router-outlet></router-outlet>
    </GridLayout>
</GridLayout>
`
})
@RouteConfig([
    { path: '/', name: 'Main', component: MasterComponent, useAsDefault: true },
    { path: '/:id', name: 'Detail', component: DetailComponent }
])
export class NavComponent implements OnActivate, OnDeactivate {
    static counter: number = 0;

    public compId: number;
    public depth: number;

    constructor(params: RouteParams, private location: Location) {
        console.log("NavComponent.constructor()");
        NavComponent.counter++;

        this.compId = NavComponent.counter;
        this.depth = parseInt(params.get("depth"));

        console.log("NavComponent.constructor() componentID: " + this.compId)
    }

    public goBack() {
        this.location.back();
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnActivate() componentID: " + this.compId)
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnDeactivate() componentID: " + this.compId)
    }

    routerCanReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        // Reuse if depth is the same.
        var reuse = (prevInstruction.params["depth"] === nextInstruction.params["depth"]);
        console.log("NavComponent.routerCanReuse() componentID: " + this.compId + " return: " + reuse);
        return reuse;
    }

    routerOnReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnReuse() componentID: " + this.compId);
    }
}
