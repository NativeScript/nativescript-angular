// "nativescript-angular/application" import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap, bootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {GestureComponent} from "./snippets/gestures.component";
import {LayoutsComponent} from "./snippets/layouts.component";
import {IconFontComponent} from "./snippets/icon-font.component";
import {APP_ROOT_VIEW} from "nativescript-angular/platform-providers";
import {Page} from "ui/page";
import {StackLayout} from "ui/layouts/stack-layout";

import * as application from "application";
import {HOOKS_LOG} from "./base.component";
import {MultiPageMain, MultiPageRouterProviders} from "./multi-page-main.component";
import {SinglePageMain, SinglePageRouterProviders} from "./single-page-main.component";
import {provide, OpaqueToken} from "@angular/core";

import {APP_ROUTER_PROVIDERS} from "./snippets/navigation/app.routes";
import {PageNavigationApp} from "./snippets/navigation/page-outlet";
import {NavigationApp} from "./snippets/navigation/router-outlet";

import { rendererTraceCategory, routerTraceCategory } from "nativescript-angular/trace";

import {BehaviorSubject} from "rxjs";

import trace = require("trace");
// trace.setCategories(rendererTraceCategory + "," + routerTraceCategory);
trace.setCategories(routerTraceCategory);
trace.enable();

// nativeScriptBootstrap(NavigationApp, [APP_ROUTER_PROVIDERS]);
// nativeScriptBootstrap(PageRouterNavigationApp, [APP_ROUTER_PROVIDERS]);


// nativeScriptBootstrap(MultiPageMain, [NS_ROUTER_PROVIDERS]);
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
            
            let singlePageHooksLog = new BehaviorSubject([]);
            const singlePageHooksLogProvider = provide(HOOKS_LOG, { useValue: singlePageHooksLog });
            bootstrap(SinglePageMain, [rootViewProvider, singlePageHooksLogProvider, SinglePageRouterProviders]);

            let multiPageHooksLog = new BehaviorSubject([]);
            const multiPageHooksLogProvider = provide(HOOKS_LOG, { useValue: multiPageHooksLog });
            bootstrap(MultiPageMain, [rootViewProvider, multiPageHooksLogProvider, MultiPageRouterProviders]);
        }

        page.on('loaded', onLoadedHandler);

        return page;
    }
});
