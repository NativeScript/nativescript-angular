import { Component, OnInit, OnDestroy, Injectable } from "@angular/core";
import { RouterConfig, ActivatedRoute, Router, ROUTER_DIRECTIVES, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from "rxjs";
import { NS_ROUTER_DIRECTIVES, nsProvideRouter, RouterExtensions, PageRoute} from "nativescript-angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";
import { BehaviorSubject} from "rxjs";

@Injectable()
class LocationLogService {
    public locationStack$ = new BehaviorSubject<Array<string>>([]);
    public routerEvents$ = new BehaviorSubject<Array<string>>([]);
    public showStack: boolean = true;

    constructor(router: Router, private strategy: NSLocationStrategy) {
        router.events.subscribe((e) => {
            this.routerEvents$.next([...this.routerEvents$.getValue(), e.toString()]);

            let states = this.strategy._getSatates()
                .map((v, i) => { 
                    return (i + "." + (v.isPageNavigation ? "[PAGE]" : "") + " \"" + v.url + "\""); 
                })
                .reverse();

            this.locationStack$.next(states);
        });
    }
}

@Component({
    selector: 'location-log',
    styleUrls: ["examples/router/styles.css"],
    template: `
    <GridLayout rows="auto *" columns="*">
        <button class="stretch"
            [text]="service.showStack ? 'show events' : 'show stack'" 
            (tap)="service.showStack=!service.showStack"></button>

        <ListView row="1" [items]="service.showStack ? (service.locationStack$ | async) : (service.routerEvents$ | async)" margin="10">
            <template let-data="item" let-odd="odd" let-even="even">
                <Label [text]="data" textWrap="true"
                    [class.odd]="odd" [class.even]="even"></Label>
            </template>
        </ListView>
    </GridLayout>
  `
})
export class LocationLog {
    constructor(private service: LocationLogService) { }
}

@Component({
    selector: "first",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES, LocationLog],
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
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES, LocationLog],
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
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES, LocationLog],
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
    selector: 'navigation-test',
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    providers: [LocationLogService],
    template: `<page-router-outlet></page-router-outlet>`
})
export class ClearHistoryAppComponent {}

const routes: RouterConfig = [
    { path: "", redirectTo: "/first", terminal: true },
    { path: "first", component: FirstComponent},
    { path: "second", component: SecondComponent},
    { path: "third", component: ThirdComponent},
];

export const ClearHistoryRouterProviders = [
    nsProvideRouter(routes, { enableTracing: false })
];