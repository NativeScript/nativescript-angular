//import "globals";
// import "./modules";
//global.registerModule("./main-page", function () { return require("./main-page"); });

//import * as profiling from "./profiling";
//profiling.start('application-start');

// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { nativeScriptBootstrap } from "./nativescript-angular/application";
import { NS_ROUTER_PROVIDERS, routerTraceCategory } from "./nativescript-angular/router";
import { rendererTraceCategory } from "./nativescript-angular/renderer";

import trace = require("trace");
// trace.setCategories(routerTraceCategory + ", " + rendererTraceCategory);
// trace.setCategories(rendererTraceCategory);
// trace.setCategories(routerTraceCategory);
trace.enable();

import {RendererTest} from './examples/renderer-test';
import {Benchmark} from './performance/benchmark';
import {ListTest} from './examples/list/list-test';
import {ListTestAsync} from "./examples/list/list-test-async";
import {ImageTest} from "./examples/image/image-test";
import {NavigationTest} from "./examples/navigation/navigation-test";
import {ActionBarTest} from "./examples/action-bar/action-bar-test";
import {ModalTest} from "./examples/modal/modal-test";
import {PlatfromDirectivesTest} from "./examples/platform-directives/platform-directives-test";
import {RouterOutletTest} from "./examples/navigation/router-outlet-test";

nativeScriptBootstrap(RendererTest).then((compRef) => {
    console.log("nativeScriptBootstrap resloved: " + compRef);
}).catch((e) => {
    console.log("nativeScriptBootstrap error: " + e);
});
//nativeScriptBootstrap(Benchmark);
//nativeScriptBootstrap(ListTest);
//nativeScriptBootstrap(ListTestAsync);
//nativeScriptBootstrap(ImageTest);
//nativeScriptBootstrap(NavigationTest, [NS_ROUTER_PROVIDERS]);
//nativeScriptBootstrap(ActionBarTest, [NS_ROUTER_PROVIDERS], { startPageActionBarHidden: false });
//nativeScriptBootstrap(ActionBarTest, [NS_ROUTER_PROVIDERS]);
//nativeScriptBootstrap(ModalTest);
//nativeScriptBootstrap(PlatfromDirectivesTest);
//nativeScriptBootstrap(RouterOutletTest, [NS_ROUTER_PROVIDERS]);
