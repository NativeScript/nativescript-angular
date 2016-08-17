//import "globals";
// import "./modules";
//global.registerModule("./main-page", function () { return require("./main-page"); });

//import * as profiling from "./profiling";
//profiling.start('application-start');

// "nativescript-angular/application" import should be first in order to load some required settings (like globals and reflect-metadata)
//import { nativeScriptBootstrap, onAfterLivesync, onBeforeLivesync} from "nativescript-angular/application";
import { NativeScriptModule, platformNativeScriptDynamic } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HTTP_PROVIDERS } from "@angular/http";
import { rendererTraceCategory, routerTraceCategory, listViewTraceCategory } from "nativescript-angular/trace";

import trace = require("trace");
// trace.setCategories(rendererTraceCategory);
trace.setCategories(routerTraceCategory);
// trace.setCategories(listViewTraceCategory);
trace.enable();

import { RendererTest } from './examples/renderer-test';
import { TabViewTest } from './examples/tab-view/tab-view-test';
import { Benchmark } from './performance/benchmark';
import { ListTest } from './examples/list/list-test';
import { ListTestAsync, ListTestFilterAsync } from "./examples/list/list-test-async";
import { ImageTest } from "./examples/image/image-test";
import { HttpTest } from "./examples/http/http-test";
import { ActionBarTest } from "./examples/action-bar/action-bar-test";
import { ModalTest } from "./examples/modal/modal-test";
import { PlatfromDirectivesTest } from "./examples/platform-directives/platform-directives-test";
import { LivesyncApp, LivesyncTestRouterProviders } from "./examples/livesync-test/livesync-test-app";

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

//nativeScriptBootstrap(ActionBarTest, [NS_ROUTER_PROVIDERS_DEPRECATED], { startPageActionBarHidden: false });
//nativeScriptBootstrap(ActionBarTest, [NS_ROUTER_PROVIDERS_DEPRECATED]);

@NgModule({
    declarations: [
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
    ],
    exports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
    ],
    providers: []
})
class ExampleModule {}

function makeExampleModule(componentType) {
    let imports: any[] = [ExampleModule];
    if (componentType.routes) {
        imports.push(NativeScriptRouterModule.forRoot(componentType.routes))
    }
    let entries = [];
    if (componentType.entries) {
        entries = componentType.entries;
    }
    entries.push(componentType);
    let providers = [];
    if (componentType.providers) {
        providers = componentType.providers
    }
    @NgModule({
        bootstrap: [componentType],
        imports: imports,
        entryComponents: entries,
        declarations: entries,
        providers: providers,
    })
    class ExampleModuleForComponent {}

    return ExampleModuleForComponent;
}

//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(RendererTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(TabViewTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(Benchmark));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ListTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ListTestAsync));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ImageTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ModalTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(HttpTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(PlatfromDirectivesTest));
platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ActionBarTest));

//new router
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(RouterOutletAppComponent));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(PageRouterOutletAppComponent));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(PageRouterOutletNestedAppComponent));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(ClearHistoryAppComponent));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(LoginAppComponent));
//animations
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationStatesTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationNgClassTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationKeyframesTest));
//platformNativeScriptDynamic().bootstrapModule(makeExampleModule(AnimationEnterLeaveTest));

// Livesync test
// var cahcedUrl: string;
// onBeforeLivesync.subscribe((compRef) => {
//     console.log("------- onBeforeLivesync");
//     if (compRef) {
//         const router = <Router>compRef.injector.get(Router);
//         cahcedUrl = router.url;
//         console.log("------- Caching URL: " + cahcedUrl);
//     }
// });

// onAfterLivesync.subscribe((compRef) => {
//     console.log("------- onAfterLivesync cachedUrl:");
//     const router = <Router>compRef.injector.get(Router);
//     router.events.subscribe(e => console.log(e.toString()));
//     if (router && cahcedUrl) {
//         setTimeout(() => { router.navigateByUrl(cahcedUrl); }, 0);
//     }
// });

// nativeScriptBootstrap(LivesyncApp, [LivesyncTestRouterProviders]);
