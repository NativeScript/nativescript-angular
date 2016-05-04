import {Component} from '@angular/core';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ComponentInstruction, RouteParams} from '@angular/router';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";

@Component({
    selector: "first",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/navigation/router-outlet-test.css"],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
    </StackLayout>`
})
class FirstComponent { }

@Component({
    selector: "second",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/navigation/router-outlet-test.css"],
    template: `
    <StackLayout>
        <Label [text]="'Second component - ' + id" class="title"></Label>
    </StackLayout>`
})
class SecondComponent {
    public id: string;
    constructor(routeParams: RouteParams) {
        this.id = routeParams.get("id");
    }
}

@Component({
    selector: 'navigation-test',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/navigation/router-outlet-test.css"],
    template: `
        <StackLayout>
            <StackLayout class="nav">
                <Button text="First" [nsRouterLink]="['First']"></Button>
                <Button text="GO(1)" [nsRouterLink]="['Second', { id: 1 }]"></Button>
                <Button text="GO(2)" [nsRouterLink]="['Second', { id: 2 }]"></Button>
                <Button text="GO(3)" [nsRouterLink]="['Second', { id: 3 }]"></Button>
            </StackLayout>
            
            <router-outlet></router-outlet>
        </StackLayout>
    `
})
@RouteConfig([
    { path: '/first', component: FirstComponent, name: 'First', useAsDefault: true },
    { path: '/second/:id', component: SecondComponent, name: 'Second' },
])
export class RouterOutletTest { }
