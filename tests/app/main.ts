// "nativescript-angular/application" import should be first in order to load some required settings (like globals and reflect-metadata)
import { NativeScriptModule, platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import {AppComponent} from "./app.component";
import {GestureComponent} from "./snippets/gestures.component";
import {LayoutsComponent} from "./snippets/layouts.component";
import {IconFontComponent} from "./snippets/icon-font.component";
import {APP_ROOT_VIEW} from "nativescript-angular/platform-providers";
import {Page} from "ui/page";
import {StackLayout} from "ui/layouts/stack-layout";

import * as application from "application";
import {HOOKS_LOG} from "./base.component";
import {MultiPageMain, routes as multiPageRoutes} from "./multi-page-main.component";
import {SinglePageMain, routes as singlePageRoutes} from "./single-page-main.component";
import {provide, OpaqueToken, NgModule} from "@angular/core";

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


// nativeScriptBootstrap(GestureComponent);
// nativeScriptBootstrap(LayoutsComponent);
// nativeScriptBootstrap(IconFontComponent);
const platform = platformNativeScriptDynamic({bootInExistingPage: true});
const root = new StackLayout();
const rootViewProvider = provide(APP_ROOT_VIEW, { useValue: root });
const singlePageHooksLog = new BehaviorSubject([]);
const singlePageHooksLogProvider = provide(HOOKS_LOG, { useValue: singlePageHooksLog });
const multiPageHooksLog = new BehaviorSubject([]);
const multiPageHooksLogProvider = provide(HOOKS_LOG, { useValue: multiPageHooksLog });

@NgModule({
    bootstrap: [
        SinglePageMain
    ],
    declarations: [
        SinglePageMain
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(singlePageRoutes),
    ],
    exports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
    ],
    providers: [
        rootViewProvider,
        singlePageHooksLogProvider,
    ]
})
class SinglePageModule {}

@NgModule({
    bootstrap: [
        MultiPageMain
    ],
    declarations: [
        MultiPageMain
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(multiPageRoutes),
    ],
    exports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
    ],
    providers: [
        rootViewProvider,
        multiPageHooksLogProvider,
    ]
})
class MultiPageModule {}


application.start({
    create: (): Page => {
        const page = new Page();
        page.content = root;

        let onLoadedHandler = function(args) {
            page.off('loaded', onLoadedHandler);
            //profiling.stop('application-start');
            console.log('Page loaded');

            //profiling.start('ng-bootstrap');
            console.log('BOOTSTRAPPING TEST APPS...');
            
            platform.bootstrapModule(SinglePageModule);
            platform.bootstrapModule(MultiPageModule);
        }

        page.on('loaded', onLoadedHandler);

        return page;
    }
});
