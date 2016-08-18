import {TestApp, registerTestApp} from "../../tests/test-app";
import { ApplicationRef } from '@angular/core';
// >> router-outlet-example
import { Component, NgModule } from '@angular/core';
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Router } from '@angular/router';
import { routes } from "./app.routes";

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
    constructor(public router: Router, public appRef: ApplicationRef) {
        registerTestApp(NavigationApp, this, appRef);
    }
    // << (hide)
}

@NgModule({
    bootstrap: [NavigationApp],
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
