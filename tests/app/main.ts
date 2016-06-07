// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap, bootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {GestureComponent} from "./snippets/gestures.component";
import {LayoutsComponent} from "./snippets/layouts.component";
import {IconFontComponent} from "./snippets/icon-font.component";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router/ns-router";
import {APP_ROOT_VIEW} from "nativescript-angular/platform-providers";
import {Page} from "ui/page";
import {Label} from "ui/label";
import {StackLayout} from "ui/layouts/stack-layout";
import * as application from "application";
//nativeScriptBootstrap(AppComponent, [NS_ROUTER_PROVIDERS]);
import {MultiPageMain} from "./multi-page-main.component";
import {SinglePageMain} from "./single-page-main.component";
import {provide} from "@angular/core";

import { rendererTraceCategory, routerTraceCategory } from "nativescript-angular/trace";

import trace = require("trace");
//trace.setCategories(rendererTraceCategory + "," + routerTraceCategory);
trace.enable();

//nativeScriptBootstrap(MultiPageMain, [NS_ROUTER_PROVIDERS]);
// nativeScriptBootstrap(GestureComponent);
// nativeScriptBootstrap(LayoutsComponent);
// nativeScriptBootstrap(IconFontComponent);
application.start({
    create: (): Page => {
        const page = new Page();
        const root = new StackLayout();
        page.content = root;

        let onLoadedHandler = function(args) {
            page.off('loaded', onLoadedHandler);
            //profiling.stop('application-start');
            console.log('Page loaded');

            //profiling.start('ng-bootstrap');
            console.log('BOOTSTRAPPING TEST APPS...');
            //bootstrap(MultiPageMain, [NS_ROUTER_PROVIDERS]);
            const rootViewProvider = provide(APP_ROOT_VIEW, { useValue: root });
            bootstrap(SinglePageMain, [rootViewProvider, NS_ROUTER_PROVIDERS]);
            bootstrap(MultiPageMain, [rootViewProvider, NS_ROUTER_PROVIDERS]);
        }

        page.on('loaded', onLoadedHandler);

        return page;
    }
});
