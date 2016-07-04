// >> page-outlet-example
import {Component} from '@angular/core';
import {nativeScriptBootstrap} from 'nativescript-angular/application';
import {Router} from '@angular/router';
import {NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';

import {APP_ROUTER_PROVIDERS} from "./app.routes";

@Component({
    selector: 'page-navigation-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
export class PageNavigationApp { 
    // >> (hide)
    constructor(public router: Router) { }
    // << (hide)
}

// >> (hide)
function start_snippet_() {
// << (hide)
nativeScriptBootstrap(PageNavigationApp, [APP_ROUTER_PROVIDERS]);
// >> (hide)
}
// << (hide)
// << page-outlet-example