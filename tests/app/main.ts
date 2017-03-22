// "nativescript-angular/platform" import
// should be first in order to load some required settings
// (like globals and reflect-metadata)

import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule, NSModuleFactoryLoader } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppComponent } from "./app.component";
import { GestureComponent } from "./snippets/gestures.component";
import { LayoutsComponent } from "./snippets/layouts.component";
import { IconFontComponent } from "./snippets/icon-font.component";
import { APP_ROOT_VIEW } from "nativescript-angular/platform-providers";
import { Page } from "ui/page";
import { StackLayout } from "ui/layouts/stack-layout";

import * as application from "application";
import "ui/styling/style";
import "ui/frame";
import { HOOKS_LOG } from "./base.component";
import { MultiPageMain, routes as multiPageRoutes } from "./multi-page-main.component";
import { SinglePageMain, routes as singlePageRoutes } from "./single-page-main.component";
import { LazyLoadMain, routes as lazyLoadRoutes } from "./lazy-load-main";
import { FirstComponent } from "./first.component";
import { SecondComponent } from "./second.component";
import { OpaqueToken, NgModule, NgModuleFactoryLoader } from "@angular/core";

import { PageNavigationApp } from "./snippets/navigation/page-outlet";
import { NavigationApp } from "./snippets/navigation/router-outlet";

import { rendererTraceCategory, routerTraceCategory } from "nativescript-angular/trace";

import { BehaviorSubject } from "rxjs/BehaviorSubject";

import trace = require("trace");
trace.setCategories(rendererTraceCategory + "," + routerTraceCategory);
// trace.setCategories(routerTraceCategory);
// trace.enable();

// nativeScriptBootstrap(GestureComponent);
// nativeScriptBootstrap(LayoutsComponent);
// nativeScriptBootstrap(IconFontComponent);
const platform = platformNativeScriptDynamic({ bootInExistingPage: true });
const root = new StackLayout();
const rootViewProvider = { provide: APP_ROOT_VIEW, useValue: root };
const singlePageHooksLog = new BehaviorSubject([]);
const singlePageHooksLogProvider = { provide: HOOKS_LOG, useValue: singlePageHooksLog };
const multiPageHooksLog = new BehaviorSubject([]);
const multiPageHooksLogProvider = { provide: HOOKS_LOG, useValue: multiPageHooksLog };
const lazyLoadHooksLog = new BehaviorSubject([]);
const lazyLoadHooksLogProvider = { provide: HOOKS_LOG, useValue: lazyLoadHooksLog };

@NgModule({
    bootstrap: [
        SinglePageMain
    ],
    declarations: [
        SinglePageMain,
        FirstComponent,
        SecondComponent,
    ],
    entryComponents: [
        SinglePageMain,
        FirstComponent,
        SecondComponent,
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
class SinglePageModule { }

@NgModule({
    bootstrap: [
        MultiPageMain
    ],
    declarations: [
        MultiPageMain,
        FirstComponent,
        SecondComponent,
    ],
    entryComponents: [
        MultiPageMain,
        FirstComponent,
        SecondComponent,
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
class MultiPageModule { }

@NgModule({
    bootstrap: [
        LazyLoadMain
    ],
    declarations: [
        LazyLoadMain,
        FirstComponent,
    ],
    entryComponents: [
        LazyLoadMain,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(lazyLoadRoutes),
    ],
    exports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
    ],
    providers: [
        rootViewProvider,
        lazyLoadHooksLogProvider,
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
    ]
})
class LazyLoadModule { }

application.start({
    create: (): Page => {
        const page = new Page();
        page.content = root;

        let onLoadedHandler = function (args) {
            page.off("loaded", onLoadedHandler);
            // profiling.stop('application-start');
            console.log("Page loaded");

            // profiling.start('ng-bootstrap');
            console.log("BOOTSTRAPPING TEST APPS...");

            platform.bootstrapModule(SinglePageModule);
            platform.bootstrapModule(MultiPageModule);
            platform.bootstrapModule(LazyLoadModule);
        };

        page.on("loaded", onLoadedHandler);

        return page;
    }
});
