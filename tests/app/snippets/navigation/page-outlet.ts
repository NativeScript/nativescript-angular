import { registerTestApp } from "../../tests/test-app";
import { ApplicationRef } from "@angular/core";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
// >> page-outlet-example
import { Component, NgModule } from "@angular/core";
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { routes } from "./app.routes";
import { FirstComponent, SecondComponent } from "./navigation-common";

@Component({
    selector: "page-navigation-test",
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageNavigationApp {
    // >> (hide)
    public startEvent: any;
    public endEvent: any;

    public done: Promise<void>;

    constructor(public router: Router, public appRef: ApplicationRef) {
        registerTestApp(PageNavigationApp, this, appRef);

        this.done = new Promise<void>((resolve, reject) => {
            this.router.events.subscribe((e) => {
                if (e instanceof NavigationStart) {
                    this.startEvent = e;
                }
                if (e instanceof NavigationEnd) {
                    this.endEvent = e;
                    resolve();
                }
            });
        });
    }
    // << (hide)
}

@NgModule({
    declarations: [PageNavigationApp, FirstComponent, SecondComponent],
    bootstrap: [PageNavigationApp],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ]
})
export class PageNavigationAppModule { }

// >> (hide)
function start_snippet_() {
// << (hide)
platformNativeScriptDynamic().bootstrapModule(PageNavigationAppModule);
// >> (hide)
}
// << (hide)
// << page-outlet-example
