//import "globals";
// import "./modules";
//global.registerModule("./main-page", function () { return require("./main-page"); });

//import * as profiling from "./profiling";
//profiling.start('application-start');

// "nativescript-angular/application" import should be first in order to load some required settings (like globals and reflect-metadata)
import { nativeScriptBootstrap, onAfterLivesync, onBeforeLivesync } from "nativescript-angular/application";
import { Router } from "@angular/router";
import { NS_ROUTER_PROVIDERS as NS_ROUTER_PROVIDERS_DEPRECATED } from "nativescript-angular/router-deprecated";
import { NS_ROUTER_PROVIDERS } from "nativescript-angular/router";
import { HTTP_PROVIDERS } from "@angular/http";
import { rendererTraceCategory, routerTraceCategory, listViewTraceCategory } from "nativescript-angular/trace";

import trace = require("trace");
// trace.setCategories(rendererTraceCategory);
// trace.setCategories(routerTraceCategory);
// trace.setCategories(listViewTraceCategory);
trace.enable();

import {RendererTest} from './examples/renderer-test';
import {TabViewTest} from './examples/tab-view/tab-view-test';
import {Benchmark} from './performance/benchmark';
import {ListTest} from './examples/list/list-test';
import {ListTestAsync, ListTestFilterAsync} from "./examples/list/list-test-async";
import {ImageTest} from "./examples/image/image-test";
import {HttpTest} from "./examples/http/http-test";
import {ActionBarTest} from "./examples/action-bar/action-bar-test";
import {ModalTest} from "./examples/modal/modal-test";
import {PlatfromDirectivesTest} from "./examples/platform-directives/platform-directives-test";
import {LivesyncApp, LivesyncTestRouterProviders} from "./examples/livesync-test/livesync-test-app";

// router-deprecated
import {NavigationTest} from "./examples/router-deprecated/navigation-test";
import {RouterOutletTest} from "./examples/router-deprecated/router-outlet-test";
import {LoginTest} from "./examples/router-deprecated/login-test";

// new router
import { RouterOutletAppComponent, RouterOutletRouterProviders} from "./examples/router/router-outlet-test"
import { PageRouterOutletAppComponent, PageRouterOutletRouterProviders } from "./examples/router/page-router-outlet-test"
import { PageRouterOutletNestedAppComponent, PageRouterOutletNestedRouterProviders } from "./examples/router/page-router-outlet-nested-test"

// animations
import { AnimationEnterLeaveTest } from "./examples/animation/animation-enter-leave-test";
import { AnimationKeyframesTest } from "./examples/animation/animation-keyframes-test";
import { AnimationNgClassTest } from "./examples/animation/animation-ngclass-test";
import { AnimationStatesTest } from "./examples/animation/animation-states-test";

// nativeScriptBootstrap(RendererTest);
//nativeScriptBootstrap(TabViewTest);
//nativeScriptBootstrap(Benchmark);
// nativeScriptBootstrap(ListTest);
// nativeScriptBootstrap(ListTestAsync);
//nativeScriptBootstrap(ImageTest);
nativeScriptBootstrap(HttpTest);
//nativeScriptBootstrap(ActionBarTest, [NS_ROUTER_PROVIDERS_DEPRECATED], { startPageActionBarHidden: false });
//nativeScriptBootstrap(ActionBarTest, [NS_ROUTER_PROVIDERS_DEPRECATED]);
//nativeScriptBootstrap(ModalTest);
//nativeScriptBootstrap(PlatfromDirectivesTest);

// new router
// nativeScriptBootstrap(RouterOutletAppComponent, [RouterOutletRouterProviders]);
// nativeScriptBootstrap(PageRouterOutletAppComponent, [PageRouterOutletRouterProviders]);
// nativeScriptBootstrap(PageRouterOutletNestedAppComponent, [PageRouterOutletNestedRouterProviders]);

// router-deprecated
// nativeScriptBootstrap(NavigationTest, [NS_ROUTER_PROVIDERS_DEPRECATED]);
// nativeScriptBootstrap(RouterOutletTest, [NS_ROUTER_PROVIDERS_DEPRECATED]);
// nativeScriptBootstrap(LoginTest, [NS_ROUTER_PROVIDERS_DEPRECATED]);

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

// animations
//nativeScriptBootstrap(AnimationStatesTest);
//nativeScriptBootstrap(AnimationNgClassTest);
//nativeScriptBootstrap(AnimationKeyframesTest);
//nativeScriptBootstrap(AnimationEnterLeaveTest);
