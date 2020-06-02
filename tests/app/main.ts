// "nativescript-angular/platform" import
// should be first in order to load some required settings
// (like globals and reflect-metadata)

import { NativeScriptModule } from "@nativescript/angular";
import { platformNativeScriptDynamic } from "@nativescript/angular/platform";
import { NativeScriptRouterModule } from "@nativescript/angular/router";
import { NativeScriptFormsModule } from "@nativescript/angular/forms";

import { AppComponent } from "./app.component";
import { GestureComponent } from "./snippets/gestures.component";
import { LayoutsComponent } from "./snippets/layouts.component";
import { IconFontComponent } from "./snippets/icon-font.component";
import { APP_ROOT_VIEW } from "@nativescript/angular/platform-providers";
import { Page } from "@nativescript/core/ui/page";
import { StackLayout } from "@nativescript/core/ui/layouts/stack-layout";

import * as application from "@nativescript/core/application";
import "tns-core-modules/ui/styling/style";
import "tns-core-modules/ui/frame";
import { HOOKS_LOG } from "./base.component";
import { MultiPageMain, routes as multiPageRoutes } from "./multi-page-main.component";
import { SinglePageMain, routes as singlePageRoutes } from "./single-page-main.component";
import { LazyLoadMain, routes as lazyLoadRoutes } from "./lazy-load-main";
import { FirstComponent } from "./first.component";
import { SecondComponent } from "./second.component";
import { InjectionToken, NgModule, NgModuleFactoryLoader } from "@angular/core";

import { PageNavigationApp } from "./snippets/navigation/page-outlet";
import { NavigationApp } from "./snippets/navigation/router-outlet";

import { rendererTraceCategory, routerTraceCategory } from "@nativescript/angular/trace";

import { BehaviorSubject } from "rxjs";

import { GridLayout, ItemSpec } from "@nativescript/core/ui/layouts/grid-layout/grid-layout";

import { enable, addCategories, categories } from "@nativescript/core/trace";
import { Color } from "@nativescript/core/color/color";

addCategories(rendererTraceCategory);
// addCategories(routerTraceCategory);
addCategories(categories.ViewHierarchy);

// trace.setCategories(routerTraceCategory);
enable();

// nativeScriptBootstrap(GestureComponent);
// nativeScriptBootstrap(LayoutsComponent);
// nativeScriptBootstrap(IconFontComponent);
const platform = platformNativeScriptDynamic({ bootInExistingPage: true });
const root = new GridLayout();

let rootViewsCount = 0;
let colors = ["lightgreen", "lightblue", "lightpink"];
function createRootProvider() {
    root.addRow(new ItemSpec(1, "star"));

    const appRootView = new StackLayout();
    GridLayout.setRow(appRootView, rootViewsCount);
    root.addChild(appRootView);
    appRootView.backgroundColor = new Color(colors[rootViewsCount % colors.length]);

    rootViewsCount++;
    return { provide: APP_ROOT_VIEW, useValue: appRootView };
}

const singlePageHooksLog = new BehaviorSubject([]);
const singlePageHooksLogProvider = { provide: HOOKS_LOG, useValue: singlePageHooksLog };
const multiPageHooksLog = new BehaviorSubject([]);
const multiPageHooksLogProvider = { provide: HOOKS_LOG, useValue: multiPageHooksLog };
const lazyLoadHooksLog = new BehaviorSubject([]);
export const lazyLoadHooksLogProvider = { provide: HOOKS_LOG, useValue: lazyLoadHooksLog };

@NgModule({
    bootstrap: [SinglePageMain],
    declarations: [SinglePageMain, FirstComponent, SecondComponent],
    entryComponents: [SinglePageMain, FirstComponent, SecondComponent],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(singlePageRoutes),
    ],
    exports: [NativeScriptModule, NativeScriptFormsModule, NativeScriptRouterModule],
    providers: [createRootProvider(), singlePageHooksLogProvider],
})
class SinglePageModule {}

@NgModule({
    bootstrap: [MultiPageMain],
    declarations: [MultiPageMain, FirstComponent, SecondComponent],
    entryComponents: [MultiPageMain, FirstComponent, SecondComponent],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(multiPageRoutes),
    ],
    exports: [NativeScriptModule, NativeScriptFormsModule, NativeScriptRouterModule],
    providers: [createRootProvider(), multiPageHooksLogProvider],
})
class MultiPageModule {}

@NgModule({
    bootstrap: [LazyLoadMain],
    declarations: [LazyLoadMain, FirstComponent],
    entryComponents: [LazyLoadMain],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(lazyLoadRoutes),
    ],
    exports: [NativeScriptModule, NativeScriptFormsModule, NativeScriptRouterModule],
    providers: [
        createRootProvider(),
        lazyLoadHooksLogProvider,
    ],
})
class LazyLoadModule {}

application.run({
    create: (): Page => {
        let onLoadedHandler = function(args) {
            root.off("loaded", onLoadedHandler);
            // profiling.stop('application-start');

            // profiling.start('ng-bootstrap');
            console.log("BOOTSTRAPPING TEST APPS...");

            platform.bootstrapModule(SinglePageModule);
            platform.bootstrapModule(MultiPageModule);
            platform.bootstrapModule(LazyLoadModule);
        };

        root.on("loaded", onLoadedHandler);

        return <any>root;
    },
});
