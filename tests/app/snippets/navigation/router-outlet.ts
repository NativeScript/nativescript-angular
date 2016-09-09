import {TestApp, registerTestApp} from "../../tests/test-app";
import { ApplicationRef } from '@angular/core';
// >> router-outlet-example
import { Component, NgModule } from '@angular/core';
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { routes } from "./app.routes";
import {FirstComponent, SecondComponent} from "./navigation-common";

@Component({
    selector: 'navigation-test',
    template: `
        <StackLayout>
            <StackLayout class="nav">
                <Button text="First" 
                    [nsRouterLink]="['/first']"></Button>
                <Button text="Second"
                    [nsRouterLink]="['/second']"></Button>
            </StackLayout>
            
            <router-outlet></router-outlet>
        </StackLayout>
    `
})
export class NavigationApp {
    // >> (hide)
    public startEvent: any;
    public endEvent: any;
    public done: Promise<void>;

    constructor(public router: Router, public appRef: ApplicationRef) {
        registerTestApp(NavigationApp, this, appRef);

        this.done = new Promise<void>((resolve, reject) => {
            this.router.events.subscribe((e) => {
                console.log("------>>>>>> Router event: " + e.toString());
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
    bootstrap: [NavigationApp],
    entryComponents: [FirstComponent, SecondComponent],
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ]
})
export class NavigationAppModule {}

// >> (hide)
function start_snippet() {
// << (hide)
platformNativeScriptDynamic().bootstrapModule(NavigationAppModule);
// >> (hide)
}
// << (hide)
// << router-outlet-example
