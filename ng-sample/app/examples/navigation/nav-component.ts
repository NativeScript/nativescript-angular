import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
LocationStrategy, RouteParams, ComponentInstruction, RouteConfig, Location } from 'angular2/router';
import {topmost} from "ui/frame";
import {NS_ROUTER_DIRECTIVES} from "../../nativescript-angular/router/ns-router";


@Component({
    selector: 'main',
    template: `
    <StackLayout>
        <Label text="Master View" style="font-size: 20; horizontal-align: center; margin: 10"></Label>
            
        <Button *ngFor="#detail of details" [text]="'Detail ' + detail" (tap)="onSelect(detail)"></Button>
    </StackLayout>
    `
})
class MainComp {
    public details: Array<number> = [1, 2, 3];

    constructor(private _router: Router) {
    }

    onSelect(val: number) {
        this._router.navigate(['../Detail', { id: val }]);
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("MainComp.routerOnActivate()")
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("MainComp.routerOnDeactivate()")
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
class DetailComp {
    public id: number;
    constructor(params: RouteParams, private _router: Router) {
        this.id = parseInt(params.get("id"));
    }

    onUnselect() {
        this._router.navigate(['../Main']);
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("DetailComp.routerOnActivate() id: " + this.id)
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("DetailComp.routerOnDeactivate() id: " + this.id)
    }
}


@Component({
    selector: 'example-group',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
<GridLayout rows="auto, auto, auto, *" columns="*, *" margin="10" backgroundColor="lightgreen">
    <Label [text]="'Componenet ID: ' + compId" colSpan="2" row="0"
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
    { path: '/', name: 'Main', component: MainComp, useAsDefault: true },
    { path: '/:id', name: 'Detail', component: DetailComp }
])
export class NavComponent implements OnActivate, OnDeactivate {
    static counter: number = 0;

    public compId: number;
    public depth: number;

    constructor(params: RouteParams, private location: Location) {
        NavComponent.counter++;

        this.compId = NavComponent.counter;
        this.depth = parseInt(params.get("depth"));

        console.log("NavComponent.constructor() componenetID: " + this.compId)
    }

    public goBack() {
        this.location.back();
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnActivate() componenetID: " + this.compId)
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnDeactivate() componenetID: " + this.compId)
    }

    routerCanReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        // Reuse if depth is the same.
        var reuse = (prevInstruction.params["depth"] === nextInstruction.params["depth"]);
        console.log("NavComponent.routerCanReuse() componenetID: " + this.compId + " return: " + reuse);
        return reuse;
    }

    routerOnReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log("NavComponent.routerOnReuse() componenetID: " + this.compId);
    }
}