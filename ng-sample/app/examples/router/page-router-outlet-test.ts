import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Page } from "ui/page";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "first",
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <Button text="Second(1)" [nsRouterLink]="['/second', '1' ]"></Button>
        <Button text="Second(2)" [nsRouterLink]="['/second', '2' ]"></Button>

        <Button text="Third(1)" [nsRouterLink]="['/third', '1' ]"></Button>
        <Button text="Third(2)" [nsRouterLink]="['/third', '2' ]"></Button>
    </StackLayout>`
})
export class FirstComponent implements OnInit, OnDestroy {
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
    template: `
    <StackLayout>
        <Label [text]="'Second component: ' + (id | async)" class="title"></Label>

        <Button text="BACK" (tap)="goBack()"></Button>
        
        <Button text="First" [nsRouterLink]="['/']"></Button>
        <Button text="Third(1)" [nsRouterLink]="['/third', '1' ]"></Button>
        <Button text="Third(2)" [nsRouterLink]="['/third', '2' ]"></Button>
    </StackLayout>`
})
export class SecondComponent implements OnInit, OnDestroy {
    public id: Observable<string>;
    constructor(private location: Location, route: ActivatedRoute, page: Page) {
        console.log("SecondComponent.constructor() page: " + page);
        this.id = route.params.pipe(map(r => r["id"]));
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
    template: `
    <StackLayout>
        <Label [text]="'Third component: ' + (id | async)" class="title"></Label>

        <Button text="BACK" (tap)="goBack()"></Button>
        
        <Button text="First" [nsRouterLink]="['/']"></Button>
        <Button text="Second(1)" [nsRouterLink]="['/second', '1' ]"></Button>
        <Button text="Second(2)" [nsRouterLink]="['/second', '2' ]"></Button>
    </StackLayout>`
})
export class ThirdComponent implements OnInit, OnDestroy {
    public id: Observable<string>;
    constructor(private location: Location, route: ActivatedRoute, page: Page) {
        console.log("ThirdComponent.constructor() page: " + page);
        this.id = route.params.pipe(map(r => r["id"]));
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
    selector: "navigation-test",
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageRouterOutletAppComponent {
    static routes = [
        { path: "", component: FirstComponent },
        { path: "second/:id", component: SecondComponent },
        { path: "third/:id", component: ThirdComponent },
    ];

    static entries = [
        FirstComponent,
        SecondComponent,
        ThirdComponent
    ];

    constructor(router: Router, private location: Location) {
        router.events.subscribe((e) => {
            console.log("--EVENT-->: " + e.toString());
        });
    }
}
