import { Component, OnInit, OnDestroy, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";
import { BehaviorSubject } from "rxjs";

@Injectable()
class LocationLogService {
    public routerEvents$ = new BehaviorSubject<Array<string>>([]);

    constructor(router: Router, private strategy: NSLocationStrategy) {
        router.events.subscribe((e) => {
            this.routerEvents$.next([...this.routerEvents$.getValue(), e.toString()]);
        });
    }
}

@Component({
    selector: "location-log",
    styleUrls: ["examples/router/styles.css"],
    template: `
    <GridLayout rows="*" columns="*">
        <ListView
            [items]="service.routerEvents$ | async"
                margin="10">

            <ng-template let-data="item" let-odd="odd" let-even="even">
                <Label [text]="data" textWrap="true"
                    [class.odd]="odd" [class.even]="even"></Label>
            </ng-template>

        </ListView>
    </GridLayout>
  `
})
export class LocationLog {
    constructor(private service: LocationLogService) { }
}

@Component({
    selector: "first",
    templateUrl: "examples/router/clear-history.component.html",
    styleUrls: ["examples/router/styles.css"]
})
class FirstComponent implements OnInit, OnDestroy {
    name = "First";
    constructor(private nav: RouterExtensions) { }
    ngOnInit() { console.log("FirstComponent - ngOnInit()"); }
    ngOnDestroy() { console.log("FirstComponent - ngOnDestroy()"); }
}

@Component({
    selector: "second",
    templateUrl: "examples/router/clear-history.component.html",
    styleUrls: ["examples/router/styles.css"]
})
class SecondComponent implements OnInit, OnDestroy {
    name = "Second";
    constructor(private nav: RouterExtensions) { }
    ngOnInit() { console.log("SecondComponent - ngOnInit()"); }
    ngOnDestroy() { console.log("SecondComponent - ngOnDestroy()"); }
}

@Component({
    selector: "third",
    templateUrl: "examples/router/clear-history.component.html",
    styleUrls: ["examples/router/styles.css"]
})
class ThirdComponent implements OnInit, OnDestroy {
    name = "Third";
    constructor(private nav: RouterExtensions) { }
    ngOnInit() { console.log("ThirdComponent - ngOnInit()"); }
    ngOnDestroy() { console.log("ThirdComponent - ngOnDestroy()"); }
}

@Component({
    selector: "navigation-test",
    providers: [LocationLogService],
    template: `<page-router-outlet></page-router-outlet>`
})
export class ClearHistoryAppComponent {
    static routes = [
        { path: "", redirectTo: "/first", terminal: true, pathMatch: "full" },
        { path: "first", component: FirstComponent },
        { path: "second", component: SecondComponent },
        { path: "third", component: ThirdComponent },
    ];

    static entries = [
        FirstComponent,
        SecondComponent,
        ThirdComponent,
        LocationLog,
    ];
}
