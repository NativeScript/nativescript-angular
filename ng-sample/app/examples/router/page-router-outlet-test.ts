import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterConfig, ActivatedRoute, Router, ROUTER_DIRECTIVES, Event } from '@angular/router';
import { Observable } from "rxjs";
import { NS_ROUTER_DIRECTIVES, nsProvideRouter} from "nativescript-angular/router"
import { Location, LocationStrategy} from '@angular/common';
import { Page } from "ui/page";


@Component({
    selector: "first",
    styleUrls: ["examples/router/styles.css"],
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <Button text="Second(1)" [nsRouterLink]="['/second', '1' ]"></Button>
        <Button text="Second(2)" [nsRouterLink]="['/second', '2' ]"></Button>

        <Button text="Third(1)" [nsRouterLink]="['/third', '1' ]"></Button>
        <Button text="Third(2)" [nsRouterLink]="['/third', '2' ]"></Button>
    </StackLayout>`
})
class FirstComponent implements OnInit, OnDestroy {
    constructor(page: Page) {
        console.log("FirstComponent.constructor() page: " + page);
    }

    ngOnInit() {
        console.log("FirstComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("FirstComponent - ngOnDestroy()");
    }
}

@Component({
    selector: "second",
    styleUrls: ["examples/router/styles.css"],
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label [text]="'Second component: ' + (id | async)" class="title"></Label>

        <Button text="BACK" (tap)="goBack()"></Button>
        
        <Button text="First" [nsRouterLink]="['/first']"></Button>
        <Button text="Third(1)" [nsRouterLink]="['/third', '1' ]"></Button>
        <Button text="Third(2)" [nsRouterLink]="['/third', '2' ]"></Button>
    </StackLayout>`
})
class SecondComponent implements OnInit, OnDestroy {
    public id: Observable<string>;
    constructor(private location: Location, route: ActivatedRoute, page: Page) {
        console.log("SecondComponent.constructor() page: " + page);
        this.id = route.params.map(r => r["id"]);
    }

    ngOnInit() {
        console.log("SecondComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("SecondComponent - ngOnDestroy()");
    }

    goBack() {
        this.location.back();
    }
}

@Component({
    selector: "third",
    styleUrls: ["examples/router/styles.css"],
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label [text]="'Third component: ' + (id | async)" class="title"></Label>

        <Button text="BACK" (tap)="goBack()"></Button>
        
        <Button text="First" [nsRouterLink]="['/first']"></Button>
        <Button text="Second(1)" [nsRouterLink]="['/second', '1' ]"></Button>
        <Button text="Second(2)" [nsRouterLink]="['/second', '2' ]"></Button>
    </StackLayout>`
})
class ThirdComponent implements OnInit, OnDestroy {
    public id: Observable<string>;
    constructor(private location: Location, route: ActivatedRoute, page: Page) {
        console.log("ThirdComponent.constructor() page: " + page);
        this.id = route.params.map(r => r["id"]);
    }

    ngOnInit() {
        console.log("ThirdComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("ThirdComponent - ngOnDestroy()");
    }

    goBack() {
        this.location.back();
    }
}






@Component({
    selector: 'navigation-test',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageRouterOutletAppComponent {
    constructor(router: Router, private location: Location) {
        router.events.subscribe((e) => {
            console.log("--EVENT-->: " + e.toString());
        })
    }
}


const routes: RouterConfig = [
    { path: "/first", component: FirstComponent },
    { path: "/", redirectTo: "/first", terminal: true },
    { path: "/second/:id", component: SecondComponent },
    { path: "/third/:id", component: ThirdComponent },
];

export const PageRouterOutletRouterProviders = [
    nsProvideRouter(routes, { enableTracing: false })
];