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
        <StackLayout class="nav">
            <Button class="link" text="Start" nsRouterLink="/second/1"></Button>
            <Button class="link" text="Detail" nsRouterLink="/second/1/detail/3"></Button>
        </StackLayout>
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
    selector: 'master',
    styleUrls: ["examples/router/styles.css"],
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout class="master">
        <Label text="Master View" class="subtitle"></Label>
            
        <Button *ngFor="let detail of details" [text]="'Detail ' + detail" [nsRouterLink]="['../detail', detail]"></Button>
    </StackLayout>
    `
})
class MasterComponent {
    public details: Array<number> = [1, 2, 3];

    constructor(private router: Router, private route: ActivatedRoute) {
        console.log("MasterComponent.constructor()");
    }
}

@Component({
    selector: 'detail',
    styleUrls: ["examples/router/styles.css"],
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout class="detail">
        <Label text="Detail View" class="subtitle"></Label>
    
        <Button text="TO MASTER" nsRouterLink="../.."></Button>
            
        <Label [text]="'Detail: ' + (id$ | async)" margin="10" horizontalAlignment="center"></Label>
    </StackLayout>
    `
})
class DetailComponent {
    public id$: Observable<string>;
    constructor(private router: Router, private route: ActivatedRoute) {
        console.log("DetailComponent.constructor()");
        this.id$ = route.params.map(r => r["id"]);
    }
}

@Component({
    selector: "second",
    styleUrls: ["examples/router/styles.css"],
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label [text]="'Second component: ' + (depth$ | async)" class="title"></Label>

        <StackLayout class="nav">
            <Button class="link" text="< BACK" (tap)="goBack()"></Button>
            <Button class="link" [text]="'Second ' + (nextDepth$ | async) + ' >'" [nsRouterLink]="['../', (nextDepth$ | async)]"></Button>
        </StackLayout>

        <router-outlet></router-outlet>

    </StackLayout>`
})
class SecondComponent implements OnInit, OnDestroy {
    public depth$: Observable<string>;
    public nextDepth$: Observable<number>;
    constructor(private location: Location, route: ActivatedRoute, page: Page) {
        console.log("SecondComponent.constructor() page: " + page);
        this.depth$ = route.params.map(r => r["depth"]);
        this.nextDepth$ = route.params.map(r => +r["depth"] + 1);
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
    selector: 'navigation-test',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageRouterOutletNestedAppComponent {
    constructor(router: Router, private location: Location) {
        router.events.subscribe((e) => {
            console.log("--EVENT-->: " + e.toString());
        })
    }
}


const routes: RouterConfig = [
    { path: "/first", component: FirstComponent },
    { path: "/", redirectTo: "/first", terminal: true },
    {
        path: "/second/:depth", component: SecondComponent,
        children: [
            { path: "/", redirectTo: "master", terminal: true },
            { path: "/master", component: MasterComponent },
            { path: "/detail/:id", component: DetailComponent }
        ]
    },
];

export const PageRouterOutletNestedRouterProviders = [
    nsProvideRouter(routes, { enableTracing: false })
];