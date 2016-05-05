import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {FirstComponent} from "../components/first.component";
import {SecondComponent} from "../components/second.component";

@Component({
    selector: 'navigation-test',
    styleUrls: ['./router/router-outlet.css'],
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: `
        <StackLayout>
            <StackLayout class="nav">
                <Button text="First" 
                    [nsRouterLink]="['First']"></Button>
                <Button text="Second"
                    [nsRouterLink]="['Second']"></Button>
            </StackLayout>

            <router-outlet></router-outlet>
        </StackLayout>
    `
})
@RouteConfig([
    { path: '/first', component: FirstComponent, name: 'First', useAsDefault: true },
    { path: '/second', component: SecondComponent, name: 'Second' },
])
export class NavigationTestRouter { }

// nativeScriptBootstrap(NavigationTestRouter, [NS_ROUTER_PROVIDERS]);