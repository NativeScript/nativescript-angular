import {Component, View} from 'angular2/core';
import {RouteConfig} from 'angular2/router';
import { Page} from "ui/page";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";
import {NS_DIRECTIVES} from "../../nativescript-angular/directives/ns-directives";

@Component({
    selector: 'action-bar-test',
    template: `
    <StackLayout>
        <android><Label text="This is android specific content"></Label></android>
        <ios><Label text="This is android specific content"></Label></ios>
    </StackLayout>
    `
})
export class PlatfromDirectivesTest {
}


