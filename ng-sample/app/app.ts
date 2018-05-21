import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { onAfterLivesync, onBeforeLivesync } from "nativescript-angular/platform-common";
import { NgModule, ErrorHandler } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import {
    rendererTraceCategory,
    routerTraceCategory,
    listViewTraceCategory,
    animationsTraceCategory,
    viewUtilCategory,
    routeReuseStrategyTraceCategory,
    bootstrapCategory,
} from "nativescript-angular/trace";
import { PAGE_FACTORY, PageFactory, PageFactoryOptions } from "nativescript-angular/platform-providers";
import { Page } from "ui/page";
import { Color } from "color";
import { log } from "tns-core-modules/profiling";

import { setCategories, addCategories, enable, categories } from "trace";
addCategories(bootstrapCategory);
// addCategories(rendererTraceCategory);
// addCategories(routerTraceCategory);
// addCategories(categories.ViewHierarchy);
// addCategories(categories.Layout);
// setCategories(routerTraceCategory);
// setCategories(listViewTraceCategory);
// setCategories(`${routeReuseStrategyTraceCategory}, ${routerTraceCategory}, ${viewUtilCategory}`);
enable();

import { RendererTest } from "./examples/renderer-test";
import { TabViewTest } from "./examples/tab-view/tab-view-test";
import { Benchmark } from "./performance/benchmark";
import { ListTest } from "./examples/list/list-test";
import { ListTemplateSelectorTest } from "./examples/list/template-selector";
import { ListTestAsync, ListTestFilterAsync } from "./examples/list/list-test-async";
import { ImageTest } from "./examples/image/image-test";
import { HttpTest } from "./examples/http/http-test";
import { HttpClientTest } from "./examples/http-client/http-client-test";
import { ActionBarTest } from "./examples/action-bar/action-bar-test";
import { PlatfromDirectivesTest } from "./examples/platform-directives/platform-directives-test";
import { LivesyncApp } from "./examples/livesync-test/livesync-test-app";

// modal
import { ModalTest } from "./examples/modal/modal-test";
import { ModalNestedTest } from "./examples/modal/modal-nested-test";
import { ModalRouterOutletTest } from "./examples/modal/modal-router-outlet-test";
import { ModalPageRouterOutletTest } from "./examples/modal/modal-page-router-outlet-test";

// new router
import { RouterOutletAppComponent } from "./examples/router/router-outlet-test";
import { PageRouterOutletAppComponent } from "./examples/router/page-router-outlet-test";
import { PageRouterOutletNestedAppComponent } from "./examples/router/page-router-outlet-nested-test";
import { ClearHistoryAppComponent } from "./examples/router/clear-history-test";
import { LoginAppComponent } from "./examples/router/login-test";

// animations
import { AnimationEnterLeaveTest } from "./examples/animation/animation-enter-leave-test";
import { AnimationKeyframesTest } from "./examples/animation/animation-keyframes-test";
import { AnimationNgClassTest } from "./examples/animation/animation-ngclass-test";
import { AnimationStatesTest } from "./examples/animation/animation-states-test";
import { AnimationStatesMultiTest } from "./examples/animation/animation-states-multi-test";

@NgModule({
    declarations: [],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptHttpClientModule,
        NativeScriptRouterModule,
    ],
    exports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptHttpClientModule,
        NativeScriptRouterModule,
    ],
    providers: [],
})
class ExampleModule { }

function makeExampleModule(componentType) {
    let imports: any[] = [NativeScriptAnimationsModule, ExampleModule];
    if (componentType.routes) {
        imports.push(NativeScriptRouterModule.forRoot(componentType.routes));
    }
    let exports: any[] = [];
    if (componentType.exports) {
        exports = componentType.exports;
    }
    let entries = [];
    if (componentType.entries) {
        entries = componentType.entries;
    }
    entries.push(componentType);

    let providers = [{ provide: ErrorHandler, useClass: MyErrorHandler }];
    if (componentType.providers) {
        providers = [...providers, componentType.providers];
    }

    @NgModule({
        bootstrap: [componentType],
        imports,
        entryComponents: entries,
        declarations: [...entries, ...exports],
        providers,
        exports,
    })
    class ExampleModuleForComponent { }

    return ExampleModuleForComponent;
}

const customPageFactoryProvider = {
    provide: PAGE_FACTORY,
    useValue: (opts: PageFactoryOptions) => {
        const page = new Page();
        page.backgroundColor = opts.isModal ? new Color("lightblue") : new Color("lightgreen");
        return page;
    },
};

class MyErrorHandler implements ErrorHandler {
    handleError(error) {
        console.log("### ErrorHandler Error: " + error.toString());
        console.log("### ErrorHandler Stack: " + error.stack);
    }
}

// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(RendererTest));
// platformNativeScriptDynamic(undefined, [customPageFactoryProvider]).bootstrapModule(makeExampleModule(RendererTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(TabViewTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(Benchmark));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ListTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ListTemplateSelectorTest));
platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ListTestAsync));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ImageTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ModalTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(HttpTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(HttpClientTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(PlatfromDirectivesTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ActionBarTest));

// router
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(RouterOutletAppComponent));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(PageRouterOutletAppComponent));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(PageRouterOutletNestedAppComponent));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ClearHistoryAppComponent));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(LoginAppComponent));

// animations
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationStatesTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationStatesMultiTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationNgClassTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationKeyframesTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationEnterLeaveTest));

// Livesync test
let cachedUrl: string;
onBeforeLivesync.subscribe(moduleRef => {
    console.log("#### onBeforeLivesync");
    // if (moduleRef) {
    //     const router = <Router>moduleRef.injector.get(Router);
    //     cachedUrl = router.url;
    //     log("-------> Caching URL: " + cachedUrl);
    // }
});

onAfterLivesync.subscribe(({ moduleRef, error }) => {
    console.log(`#### onAfterLivesync moduleRef: ${moduleRef} error: ${error}`);
    // if (moduleRef) {
    //     const router = <Router>moduleRef.injector.get(Router);
    //     router.events.subscribe(e => log(e.toString()));
    //     if (router && cachedUrl) {
    //         setTimeout(() => {
    //             router.navigateByUrl(cachedUrl);
    //         }, 0);
    //     }
    // }
});

// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(LivesyncApp));
// console.log("APP RESTART!!!!  !!!");
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ModalTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ModalNestedTest));
// platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ModalRouterOutletTest));
platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ModalPageRouterOutletTest));
