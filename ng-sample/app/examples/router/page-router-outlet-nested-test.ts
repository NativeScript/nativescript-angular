import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Page } from "ui/page";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

@Component({
    selector: "first",
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <StackLayout class="nav">
            <Button class="link" text="Start" [nsRouterLink]="['second','1']"></Button>
            <Button class="link" text="Detail" [nsRouterLink]="['second','1','detail','3']"></Button>
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
    selector: "master",
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout class="master">
        <Label text="Master View" class="subtitle"></Label>
            
        <Button *ngFor="let detail of details" [text]="'Detail ' + detail" [nsRouterLink]="['detail', detail]"></Button>
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
    selector: "detail",
    styleUrls: ["examples/router/styles.css"],
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
    template: `
    <StackLayout>
        <Label [text]="'Second component: ' + (depth$ | async)" class="title"></Label>

        <Button class="link" text="Nav to First" [nsRouterLink]="['/']"></Button>

        <StackLayout class="nav">
            <Button class="link" text="< BACK" (tap)="goBack()"></Button>
            <Button class="link"
                [text]="'Second ' + (nextDepth$ | async) + ' >'"
                [nsRouterLink]="['/second', (nextDepth$ | async)]">
            </Button>
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
    selector: "navigation-test",
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageRouterOutletNestedAppComponent {
    static routes = [
        { path: "", component: FirstComponent },
        {
            path: "second/:depth", component: SecondComponent,
            children: [
                { path: "", component: MasterComponent },
                { path: "detail/:id", component: DetailComponent }
            ]
        },
    ];

    static entries = [
        FirstComponent,
        SecondComponent,
        MasterComponent,
        DetailComponent
    ];

    constructor(router: Router, private location: Location) {
        router.events.subscribe((e) => {
            console.log("--EVENT-->: " + e.toString());
        });
    }
}
