import {TestApp, registerTestApp} from "../../tests/test-app";
import { ApplicationRef } from '@angular/core';
// >> page-outlet-example
import { Component, NgModule } from '@angular/core';
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { routes } from "./app.routes";

@Component({
    selector: 'page-navigation-test',
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
                console.log("------>>>>>> PageRouter event: " + e.toString());
                if (e instanceof NavigationStart) {
                    this.startEvent = e;
                }
                if (e instanceof NavigationEnd) {
                    this.endEvent = e
                    resolve();
                }
            });
        });
    }
    // << (hide)
}

@NgModule({
    bootstrap: [PageNavigationApp],
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ]
})
export class PageNavigationAppModule {}

// >> (hide)
function start_snippet_() {
// << (hide)
platformNativeScriptDynamic().bootstrapModule(PageNavigationAppModule);
// >> (hide)
}
// << (hide)
// << page-outlet-example
