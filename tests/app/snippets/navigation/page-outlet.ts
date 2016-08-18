import {TestApp, registerTestApp} from "../../tests/test-app";
import { ApplicationRef } from '@angular/core';
// >> page-outlet-example
import { Component, NgModule } from '@angular/core';
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Router } from '@angular/router';
import { routes } from "./app.routes";

@Component({
    selector: 'page-navigation-test',
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageNavigationApp { 
    // >> (hide)
    constructor(public router: Router, public appRef: ApplicationRef) {
        registerTestApp(PageNavigationApp, this, appRef);
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
